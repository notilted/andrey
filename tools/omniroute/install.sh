#!/usr/bin/env bash
# Ставит OmniRoute, запускает сервер и подключает его к Claude Code как MCP-сервер.
# Linux / macOS. Запуск: bash tools/omniroute/install.sh
# Повторный запуск безопасен: пароль и ключ берутся из ~/.omniroute/claude-setup.env.
set -euo pipefail

PORT="${OMNIROUTE_PORT:-20128}"
BASE="http://localhost:${PORT}"
STATE_DIR="${HOME}/.omniroute"
STATE="${STATE_DIR}/claude-setup.env"
COOKIES="$(mktemp)"
trap 'rm -f "$COOKIES"' EXIT

say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nОшибка: %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null || die "нужен Node.js 22.22.2+ или 24+ (https://nodejs.org)"
command -v npm  >/dev/null || die "не найден npm"
command -v curl >/dev/null || die "не найден curl"
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 22 ] || die "Node.js $(node -v) слишком старый, нужен 22.22.2+ или 24+"

say "Устанавливаю omniroute из npm"
if ! command -v omniroute >/dev/null; then
  npm install -g omniroute || sudo npm install -g omniroute
fi
omniroute --version

wait_up() {
  for _ in $(seq 1 90); do
    curl -s -o /dev/null "${BASE}/" && return 0
    sleep 2
  done
  die "сервер не поднялся на ${BASE}"
}

say "Запускаю сервер на ${BASE}"
if ! curl -s -o /dev/null "${BASE}/"; then
  omniroute serve --daemon --no-open --port "$PORT" >/dev/null 2>&1 &
fi
wait_up

mkdir -p "$STATE_DIR"
# shellcheck disable=SC1090
[ -f "$STATE" ] && . "$STATE"

if [ -z "${OMNI_PASSWORD:-}" ]; then
  say "Задаю пароль администратора"
  OMNI_PASSWORD="$(node -e 'console.log(require("crypto").randomBytes(12).toString("hex"))')"
  omniroute setup --password "$OMNI_PASSWORD" --non-interactive >/dev/null
fi

curl -sf -c "$COOKIES" -X POST "${BASE}/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"password\":\"${OMNI_PASSWORD}\"}" >/dev/null \
  || die "не удалось войти; удалите ${STATE} и задайте пароль заново: omniroute setup --password <пароль>"

NEED_RESTART=0
if [ -z "${OMNI_KEY:-}" ]; then
  say "Создаю API-ключ для Claude Code"
  RESP="$(curl -sf -b "$COOKIES" -X POST "${BASE}/api/keys" \
    -H 'Content-Type: application/json' -d '{"name":"claude-code"}')"
  OMNI_KEY="$(printf '%s' "$RESP" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).key))')"
  OMNI_KEY_ID="$(printf '%s' "$RESP" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).id))')"
  # Без scope "manage" ключ не пускают в /api/mcp/*
  curl -sf -b "$COOKIES" -X PATCH "${BASE}/api/keys/${OMNI_KEY_ID}" \
    -H 'Content-Type: application/json' -d '{"scopes":["manage"]}' >/dev/null
  NEED_RESTART=1
fi

umask 077
cat > "$STATE" <<EOF
OMNI_PASSWORD='${OMNI_PASSWORD}'
OMNI_KEY='${OMNI_KEY}'
OMNI_KEY_ID='${OMNI_KEY_ID:-}'
EOF

if [ "$NEED_RESTART" = 1 ]; then
  # сервер кэширует права ключа — перезапуск, чтобы подхватить "manage"
  say "Перезапускаю сервер"
  omniroute stop >/dev/null 2>&1 || true
  sleep 3
  omniroute serve --daemon --no-open --port "$PORT" >/dev/null 2>&1 &
  wait_up
fi

say "Включаю MCP-сервер OmniRoute"
curl -sf -X PATCH "${BASE}/api/settings" \
  -H "Authorization: Bearer ${OMNI_KEY}" -H 'Content-Type: application/json' \
  -d '{"mcpEnabled":true,"mcpTransport":"streamable-http"}' >/dev/null

if command -v claude >/dev/null; then
  say "Подключаю OmniRoute к Claude Code"
  claude mcp remove --scope user omniroute >/dev/null 2>&1 || true
  claude mcp add --scope user --transport http omniroute "${BASE}/api/mcp/stream" \
    --header "Authorization: Bearer ${OMNI_KEY}"
  claude mcp list 2>/dev/null | grep -i omniroute || true
else
  echo "Claude Code не найден. Когда установите его, выполните:"
  echo "  claude mcp add --scope user --transport http omniroute ${BASE}/api/mcp/stream --header \"Authorization: Bearer ${OMNI_KEY}\""
fi

cat <<EOF

Готово.
  Панель:   ${BASE}   (пароль: ${OMNI_PASSWORD})
  API:      ${BASE}/v1   (ключ: ${OMNI_KEY})
  Данные сохранены в ${STATE}

Дальше: откройте панель, добавьте свои аккаунты/ключи провайдеров (Providers),
и при желании запустите Claude Code через OmniRoute:  omniroute run claude
Автозапуск при загрузке (Linux): omniroute autostart enable
EOF
