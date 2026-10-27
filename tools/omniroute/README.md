# OmniRoute для Claude Code

[OmniRoute](https://github.com/cheaper-inference/OmniRoute) — локальный AI-шлюз (`http://localhost:20128`).
Скрипт ставит его и подключает к Claude Code как MCP-сервер.

```bash
bash tools/omniroute/install.sh
```

Что делает скрипт:
1. `npm install -g omniroute` (нужен Node.js 22.22.2+ или 24+);
2. запускает сервер в фоне;
3. задаёт пароль панели и создаёт API-ключ со scope `manage`;
4. включает MCP-сервер OmniRoute;
5. `claude mcp add --scope user --transport http omniroute …` и проверяет подключение.

Пароль и ключ сохраняются в `~/.omniroute/claude-setup.env`, повторный запуск ничего не ломает.
Windows: запускайте из WSL или Git Bash.

После установки откройте `http://localhost:20128`, добавьте свои аккаунты/ключи провайдеров.
Запуск Claude Code через шлюз: `omniroute run claude`.
