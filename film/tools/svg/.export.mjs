// tools/svg/export.tsx
import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";

// src/components/Character.tsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var LOOKS = {
  mark: { skin: "#c29479", skinShade: "#9c7461", hair: "#171a21", top: "#3d4a5f", topShade: "#2d374a", bottom: "#232833", shoes: "#13161c", scale: 1, headScale: 1, torso: 132, width: 74 },
  alisa: { skin: "#d3a689", skinShade: "#ad826b", hair: "#5e3a2a", top: "#c98a36", topShade: "#a06c2a", bottom: "#2c3446", shoes: "#3a2328", scale: 0.66, headScale: 1.22, torso: 120, width: 70 },
  galina: { skin: "#c99f88", skinShade: "#a07e6d", hair: "#a7a9ad", top: "#6b2f38", topShade: "#52242c", bottom: "#2f3340", shoes: "#1b1d22", scale: 0.9, headScale: 1.02, torso: 128, width: 80 },
  lev: { skin: "#b98e78", skinShade: "#93705f", hair: "#0f1115", top: "#2c3834", topShade: "#202a27", bottom: "#1d2128", shoes: "#101216", scale: 1.02, headScale: 0.97, torso: 136, width: 66 }
};
var rad = (d) => d * Math.PI / 180;
var Limb = ({ x, y, a1, a2, l1, l2, w, color, end, endR }) => {
  const ex = x + Math.sin(rad(a1)) * l1;
  const ey = y + Math.cos(rad(a1)) * l1;
  const hx = ex + Math.sin(rad(a1 + a2)) * l2;
  const hy = ey + Math.cos(rad(a1 + a2)) * l2;
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("path", { d: `M${x} ${y} L${ex} ${ey} L${hx} ${hy}`, stroke: color, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: hx, cy: hy, r: endR, fill: end })
  ] });
};
var Hair = ({ who, c, f }) => {
  switch (who) {
    case "mark":
      return /* @__PURE__ */ jsx("path", { d: "M-33 -6 C-38 -40 -14 -52 6 -50 C26 -49 38 -38 36 -18 C30 -26 20 -30 8 -30 C-6 -30 -16 -24 -22 -12 Z", fill: c });
    case "alisa": {
      const sway = Math.sin(f / 18) * 3;
      return /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("path", { d: `M-30 -24 C-46 -20 ${-56 + sway} 0 ${-50 + sway} 26 C${-44 + sway} 34 -36 22 -34 6 Z`, fill: c }),
        /* @__PURE__ */ jsx("circle", { cx: -31, cy: -24, r: 6, fill: "#f2b448" }),
        /* @__PURE__ */ jsx("path", { d: "M-34 4 C-40 -36 -12 -52 8 -50 C28 -48 40 -36 36 -12 C32 -22 22 -32 6 -32 C0 -22 -14 -18 -24 -16 C-26 -6 -28 0 -34 4 Z", fill: c })
      ] });
    }
    case "galina":
      return /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("circle", { cx: -22, cy: -44, r: 16, fill: c }),
        /* @__PURE__ */ jsx("path", { d: "M-34 0 C-40 -36 -14 -52 6 -50 C28 -49 38 -36 36 -14 C26 -28 10 -34 -6 -30 C-18 -26 -24 -16 -26 -4 Z", fill: c })
      ] });
    case "lev":
      return /* @__PURE__ */ jsx("path", { d: "M-33 -4 C-36 -42 -10 -54 12 -50 C30 -47 40 -34 37 -20 C26 -34 6 -36 -10 -30 C-20 -24 -26 -14 -28 -2 Z", fill: c });
  }
};
var Character = ({ who, x, y, size = 1, facing = 1, pose = {}, frame = 0, opacity = 1, override, hair }) => {
  const L = override ? { ...LOOKS[who], ...override } : LOOKS[who];
  const gid = "rim" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const {
    sit = 0,
    lean = 0,
    headTilt = 0,
    look = 0,
    lookUp = 0,
    armF = [10, -20],
    armB = [-8, -15],
    blink = 1,
    mouth = 0,
    brow = 0,
    smile = 0,
    step = 0,
    rim = 0.8,
    rimColor = "#f2b448"
  } = pose;
  const thigh = 78;
  const shin = 82;
  const tA = sit * 88;
  const hipY = -(shin + Math.cos(rad(tA)) * thigh) - 6;
  const breathe = Math.sin(frame / 22) * 1.2;
  const torsoTop = hipY - L.torso + breathe;
  const sw = step ? Math.sin(step) * 22 : 0;
  const hw = L.width / 2;
  const hs = L.headScale;
  const headY = torsoTop - 40 * hs;
  const lx = look * 3.5;
  const ly = lookUp * -3;
  const eyeH = 5.2 * Math.max(0.08, blink);
  const browA = brow * 12;
  const browC = who === "galina" ? "#7a7c80" : L.hair;
  const leg = (dx, phase, back) => {
    const kneeA = tA + phase;
    const kx = dx + Math.sin(rad(kneeA)) * thigh;
    const ky = hipY + Math.cos(rad(kneeA)) * thigh;
    const fx = kx - (sit > 0.5 ? 0 : phase * 0.3);
    const fy = ky + shin;
    return /* @__PURE__ */ jsxs("g", { opacity: back ? 0.85 : 1, children: [
      /* @__PURE__ */ jsx("path", { d: `M${dx} ${hipY} L${kx} ${ky} L${fx} ${fy - 6}`, stroke: back ? shade(L.bottom) : L.bottom, strokeWidth: 30, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
      /* @__PURE__ */ jsx("path", { d: `M${fx - 12} ${fy - 2} Q${fx - 12} ${fy - 16} ${fx + 4} ${fy - 14} L${fx + 22} ${fy - 8} Q${fx + 26} ${fy} ${fx + 18} ${fy} Z`, fill: L.shoes })
    ] });
  };
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y}) scale(${size * L.scale * facing} ${size * L.scale})`, opacity, children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gid, x1: "0", x2: "1", y1: "0", y2: "0", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: rimColor, stopOpacity: rim * 0.55 }),
      /* @__PURE__ */ jsx("stop", { offset: "0.16", stopColor: rimColor, stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsx("ellipse", { cx: sit > 0.5 ? 30 : 0, cy: 0, rx: 70, ry: 8, fill: "#000", opacity: 0.35 }),
    leg(-8, -sw, true),
    /* @__PURE__ */ jsx("g", { transform: `rotate(${lean} 0 ${hipY})`, children: /* @__PURE__ */ jsx(Limb, { x: -hw * 0.45, y: torsoTop + 16, a1: armB[0], a2: armB[1], l1: 64, l2: 60, w: 24, color: L.topShade, end: L.skinShade, endR: 10 }) }),
    leg(8, sw, false),
    /* @__PURE__ */ jsxs("g", { transform: `rotate(${lean} 0 ${hipY})`, children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${hw - 22} ${torsoTop - 2} Q${hw} ${torsoTop} ${hw} ${torsoTop + 22} L${hw - 4} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`,
          fill: L.top
        }
      ),
      /* @__PURE__ */ jsx("path", { d: `M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${-hw + 30} ${torsoTop - 2} L${-hw + 16} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`, fill: L.topShade }),
      who === "galina" && /* @__PURE__ */ jsx("path", { d: `M-6 ${torsoTop} L6 ${torsoTop} L4 ${hipY + 8} L-4 ${hipY + 8} Z`, fill: "#4a1f27" }),
      who === "lev" && /* @__PURE__ */ jsx("rect", { x: -16, y: torsoTop - 12, width: 32, height: 18, rx: 6, fill: L.top }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${-hw} ${torsoTop + 22} Q${-hw} ${torsoTop} ${-hw + 22} ${torsoTop - 2} L${hw - 22} ${torsoTop - 2} Q${hw} ${torsoTop} ${hw} ${torsoTop + 22} L${hw - 4} ${hipY + 8} L${-hw + 4} ${hipY + 8} Z`,
          fill: `url(#${gid})`
        }
      ),
      /* @__PURE__ */ jsxs("g", { transform: `translate(${4} ${headY}) rotate(${headTilt}) scale(${hs})`, children: [
        /* @__PURE__ */ jsx("rect", { x: -9, y: 22, width: 18, height: 22, fill: L.skinShade }),
        /* @__PURE__ */ jsx("path", { d: "M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z", fill: L.skin }),
        /* @__PURE__ */ jsx("path", { d: "M-32 -6 C-34 -36 -16 -46 -6 -46 C-20 -30 -22 10 -4 36 C-18 34 -31 18 -32 -6 Z", fill: L.skinShade, opacity: 0.55 }),
        /* @__PURE__ */ jsx("ellipse", { cx: -14 + lx * 0.3, cy: 2, rx: 6, ry: 9, fill: L.skinShade }),
        /* @__PURE__ */ jsx(Hair, { who: hair ?? who, c: L.hair, f: frame }),
        /* @__PURE__ */ jsx("clipPath", { id: `${gid}h`, children: /* @__PURE__ */ jsx("path", { d: "M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z" }) }),
        /* @__PURE__ */ jsx("g", { clipPath: `url(#${gid}h)`, children: /* @__PURE__ */ jsxs("g", { transform: `translate(${lx} ${ly})`, children: [
          /* @__PURE__ */ jsx("path", { d: `M${3} ${-15 - browA * 0.3} l10 ${-2 + browA * 0.35}`, stroke: browC, strokeWidth: 3.2, strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("path", { d: `M${20} ${-17 + browA * 0.2} l9 ${2 + browA * 0.25}`, stroke: browC, strokeWidth: 3.2, strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("ellipse", { cx: 9, cy: -4, rx: 3.5, ry: eyeH, fill: "#11131a" }),
          /* @__PURE__ */ jsx("ellipse", { cx: 25, cy: -4, rx: 3.2, ry: eyeH, fill: "#11131a" }),
          blink > 0.6 && /* @__PURE__ */ jsx("circle", { cx: 10, cy: -6, r: 1.1, fill: "#fff", opacity: 0.8 }),
          /* @__PURE__ */ jsx("path", { d: "M27 2 Q32 9 29 12 Q25 13.5 22.5 11.5 Q26 9 27 2 Z", fill: L.skinShade }),
          mouth > 0.06 ? /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("path", { d: `M${13} 21 Q${18.5} ${19.5 - mouth} 24 21 Q${24 - mouth * 0.5} ${21 + 2 + mouth * 6} 18.5 ${21 + 2 + mouth * 6} Q${13 + mouth * 0.5} ${21 + 2 + mouth * 6} 13 21 Z`, fill: "#3d1f20" }),
            mouth > 0.35 && /* @__PURE__ */ jsx("ellipse", { cx: 18.5, cy: 21 + 1.5 + mouth * 5, rx: 3, ry: mouth * 1.6, fill: "#8a4a48" })
          ] }) : /* @__PURE__ */ jsx("path", { d: `M13 ${21 - smile} Q18.5 ${21 + smile * 4.5 - brow * 1.2} 24 ${21 - smile}`, stroke: "#5a2f2b", strokeWidth: 2.4, fill: "none", strokeLinecap: "round" }),
          who === "galina" && /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#d9d2c0", strokeWidth: 2, opacity: 0.9, children: [
            /* @__PURE__ */ jsx("circle", { cx: 9, cy: -4, r: 7 }),
            /* @__PURE__ */ jsx("circle", { cx: 25, cy: -4, r: 6.5 }),
            /* @__PURE__ */ jsx("path", { d: "M16 -4 L18.5 -4" })
          ] })
        ] }) }),
        who === "galina" && /* @__PURE__ */ jsx("path", { d: "M2 -6 L-14 -8", stroke: "#d9d2c0", strokeWidth: 2, opacity: 0.9 }),
        /* @__PURE__ */ jsx("path", { d: "M-32 -6 C-34 -36 -16 -46 4 -46 C26 -46 36 -32 35 -8 C35 16 26 34 6 36 C-16 37 -31 20 -32 -6 Z", fill: `url(#${gid})` })
      ] }),
      /* @__PURE__ */ jsx(Limb, { x: hw * 0.35, y: torsoTop + 16, a1: armF[0], a2: armF[1], l1: 64, l2: 60, w: 25, color: L.top, end: L.skin, endR: 10.5 })
    ] })
  ] });
};
var shade = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round((n >> 16 & 255) * 0.75);
  const g = Math.round((n >> 8 & 255) * 0.75);
  const b = Math.round((n & 255) * 0.75);
  return `rgb(${r},${g},${b})`;
};

// src/theme.ts
var C = {
  // фон / ночь
  void: "#06080d",
  bg: "#0b0f17",
  sky0: "#080b14",
  sky1: "#101723",
  sky2: "#18202e",
  ground: "#0a0d14",
  // здания
  far: "#121824",
  mid: "#19202d",
  midHi: "#1f2735",
  facade: "#222a38",
  facadeHi: "#2b3442",
  seam: "#1a2029",
  winDark: "#141a24",
  winDim: "#28303e",
  // свет
  warm: "#f2b448",
  warmSoft: "#f3e083",
  lamp: "#ffd98a",
  moon: "#b0ab9d",
  tv: "#7fa6e8",
  red: "#d85445",
  redHot: "#ff4a3a",
  white: "#f2f2ee",
  grey: "#9aa1ad",
  dim: "#4a5160",
  // интерьер
  wall: "#2b303a",
  wallHi: "#353d4f",
  floor: "#1d222b",
  wood: "#3a3230",
  woodHi: "#4a3f3a"
};

// src/util.ts
import { Easing, interpolate } from "remotion";
var ease = Easing.bezier(0.45, 0, 0.25, 1);
var easeOut = Easing.bezier(0.16, 1, 0.3, 1);
var rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// src/components/City.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Sky = ({ f, w = 1080, h = 1300, moon = [860, 230] }) => /* @__PURE__ */ jsxs2("g", { children: [
  /* @__PURE__ */ jsxs2("defs", { children: [
    /* @__PURE__ */ jsxs2("linearGradient", { id: "sky", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx2("stop", { offset: "0", stopColor: C.sky0 }),
      /* @__PURE__ */ jsx2("stop", { offset: "0.65", stopColor: C.sky1 }),
      /* @__PURE__ */ jsx2("stop", { offset: "1", stopColor: C.sky2 })
    ] }),
    /* @__PURE__ */ jsxs2("radialGradient", { id: "moonGlow", children: [
      /* @__PURE__ */ jsx2("stop", { offset: "0", stopColor: C.moon, stopOpacity: 0.22 }),
      /* @__PURE__ */ jsx2("stop", { offset: "1", stopColor: C.moon, stopOpacity: 0 })
    ] })
  ] }),
  /* @__PURE__ */ jsx2("rect", { x: -2e3, y: -1e3, width: w + 4e3, height: h + 1e3, fill: "url(#sky)" }),
  Array.from({ length: 150 }).map((_, i) => {
    const x = rand(i) * (w + 1400) - 700;
    const y = rand(i + 500) * h * 0.85 - 200;
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (18 + rand(i + 9) * 30) + i));
    return /* @__PURE__ */ jsx2("circle", { cx: x, cy: y, r: 0.8 + rand(i + 77) * 1.6, fill: "#cfd6e6", opacity: 0.25 + 0.5 * tw * rand(i + 3) }, i);
  }),
  /* @__PURE__ */ jsx2("circle", { cx: moon[0], cy: moon[1], r: 150, fill: "url(#moonGlow)" }),
  /* @__PURE__ */ jsx2("circle", { cx: moon[0], cy: moon[1], r: 46, fill: C.moon }),
  /* @__PURE__ */ jsx2("circle", { cx: moon[0] - 14, cy: moon[1] - 10, r: 9, fill: "#9d988a" }),
  /* @__PURE__ */ jsx2("circle", { cx: moon[0] + 16, cy: moon[1] + 8, r: 6, fill: "#a29d90" }),
  /* @__PURE__ */ jsx2("circle", { cx: moon[0] - 4, cy: moon[1] + 20, r: 5, fill: "#a29d90" })
] });
var FarSkyline = ({ f, base }) => {
  const blocks = Array.from({ length: 34 }).map((_, i) => {
    const x = -700 + i * 75 + rand(i + 40) * 30;
    const hgt = 90 + rand(i + 41) * 170;
    return { x, w: 50 + rand(i + 42) * 60, h: hgt, i };
  });
  const blinkOn = Math.floor(f / 20) % 2 === 0;
  return /* @__PURE__ */ jsxs2("g", { children: [
    blocks.map((b) => /* @__PURE__ */ jsxs2("g", { children: [
      /* @__PURE__ */ jsx2("rect", { x: b.x, y: base - b.h, width: b.w, height: b.h, fill: C.far }),
      Array.from({ length: 6 }).map(
        (_, k) => rand(b.i * 13 + k) > 0.72 ? /* @__PURE__ */ jsx2("rect", { x: b.x + 8 + k % 3 * 14, y: base - b.h + 14 + Math.floor(k / 3) * 22 + rand(k + b.i) * 40, width: 6, height: 7, fill: C.warm, opacity: 0.45 }, k) : null
      )
    ] }, b.i)),
    /* @__PURE__ */ jsxs2("g", { fill: C.far, children: [
      /* @__PURE__ */ jsx2("rect", { x: -260, y: base - 300, width: 160, height: 300 }),
      /* @__PURE__ */ jsx2("rect", { x: -230, y: base - 380, width: 100, height: 80 }),
      /* @__PURE__ */ jsx2("rect", { x: -205, y: base - 450, width: 50, height: 70 }),
      /* @__PURE__ */ jsx2("polygon", { points: `${-190},${base - 450} ${-180},${base - 560} ${-170},${base - 450}` }),
      /* @__PURE__ */ jsx2("circle", { cx: -180, cy: base - 565, r: 6 })
    ] }),
    /* @__PURE__ */ jsxs2("g", { fill: C.far, children: [
      /* @__PURE__ */ jsx2("polygon", { points: `1270,${base} 1330,${base} 1306,${base - 260} 1294,${base - 260}` }),
      /* @__PURE__ */ jsx2("rect", { x: 1293, y: base - 520, width: 14, height: 262 }),
      /* @__PURE__ */ jsx2("rect", { x: 1284, y: base - 400, width: 32, height: 22, rx: 4 }),
      /* @__PURE__ */ jsx2("rect", { x: 1297, y: base - 640, width: 6, height: 122 }),
      /* @__PURE__ */ jsx2("circle", { cx: 1300, cy: base - 642, r: 4, fill: C.red, opacity: blinkOn ? 1 : 0.25 }),
      /* @__PURE__ */ jsx2("circle", { cx: 1300, cy: base - 420, r: 3, fill: C.red, opacity: blinkOn ? 0.25 : 0.9 })
    ] })
  ] });
};
var MidTowers = ({ f, base }) => {
  const towers = [
    { x: -520, w: 300, h: 760 },
    { x: -160, w: 250, h: 560 },
    { x: 950, w: 280, h: 820 },
    { x: 1290, w: 300, h: 600 }
  ];
  return /* @__PURE__ */ jsx2("g", { children: towers.map((t, ti) => /* @__PURE__ */ jsxs2("g", { children: [
    /* @__PURE__ */ jsx2("rect", { x: t.x, y: base - t.h, width: t.w, height: t.h, fill: C.mid }),
    /* @__PURE__ */ jsx2("rect", { x: t.x, y: base - t.h, width: 10, height: t.h, fill: C.midHi }),
    Array.from({ length: Math.floor(t.h / 46) - 1 }).map(
      (_, r) => Array.from({ length: Math.floor(t.w / 46) }).map((__, c) => {
        const s = rand(ti * 1e3 + r * 31 + c);
        const lit = s > 0.82;
        const flick = lit && s > 0.97 ? 0.6 + 0.4 * Math.sin(f / 3 + r) : 1;
        return /* @__PURE__ */ jsx2(
          "rect",
          {
            x: t.x + 18 + c * 46,
            y: base - t.h + 22 + r * 46,
            width: 24,
            height: 26,
            fill: lit ? s > 0.95 ? C.tv : C.warm : C.winDark,
            opacity: lit ? 0.75 * flick : 1
          },
          `${r}-${c}`
        );
      })
    ),
    /* @__PURE__ */ jsx2("rect", { x: t.x + t.w / 2 - 2, y: base - t.h - 40, width: 4, height: 40, fill: C.mid }),
    /* @__PURE__ */ jsx2("circle", { cx: t.x + t.w / 2, cy: base - t.h - 42, r: 4, fill: C.red, opacity: Math.floor(f / 24 + ti) % 2 ? 0.9 : 0.2 })
  ] }, ti)) });
};
var Street = ({ f, y, w = 1080 }) => {
  const cars = [
    { speed: 4.2, off: 0, dir: 1, lane: 0, col: "#2a3140" },
    { speed: 3.1, off: 900, dir: -1, lane: 1, col: "#343041" },
    { speed: 5, off: 1600, dir: 1, lane: 0, col: "#26303a" }
  ];
  const span = w + 1800;
  return /* @__PURE__ */ jsxs2("g", { children: [
    /* @__PURE__ */ jsx2("defs", { children: /* @__PURE__ */ jsxs2("radialGradient", { id: "lampHalo", children: [
      /* @__PURE__ */ jsx2("stop", { offset: "0", stopColor: C.lamp, stopOpacity: 0.35 }),
      /* @__PURE__ */ jsx2("stop", { offset: "1", stopColor: C.lamp, stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsx2("rect", { x: -1500, y, width: w + 3e3, height: 2e3, fill: C.ground }),
    /* @__PURE__ */ jsx2("rect", { x: -1500, y, width: w + 3e3, height: 26, fill: "#151a24" }),
    /* @__PURE__ */ jsx2("rect", { x: -1500, y: y + 40, width: w + 3e3, height: 110, fill: "#0d1018" }),
    Array.from({ length: 40 }).map((_, i) => /* @__PURE__ */ jsx2("rect", { x: -1500 + i * 120 - f * 0 % 120, y: y + 93, width: 60, height: 4, fill: "#2a2f3a" }, i)),
    [-300, 160, 620, 1080, 1540].map((lx, i) => /* @__PURE__ */ jsxs2("g", { children: [
      /* @__PURE__ */ jsx2("rect", { x: lx, y: y - 210, width: 6, height: 212, fill: "#1c212b" }),
      /* @__PURE__ */ jsx2("path", { d: `M${lx + 3} ${y - 210} q 0 -14 26 -14`, stroke: "#1c212b", strokeWidth: 6, fill: "none" }),
      /* @__PURE__ */ jsx2("ellipse", { cx: lx + 34, cy: y - 222, rx: 12, ry: 5, fill: C.lamp }),
      /* @__PURE__ */ jsx2("circle", { cx: lx + 34, cy: y - 222, r: 60, fill: "url(#lampHalo)" }),
      /* @__PURE__ */ jsx2("ellipse", { cx: lx + 34, cy: y + 12, rx: 80, ry: 12, fill: "url(#lampHalo)" })
    ] }, i)),
    cars.map((c, i) => {
      const px = (c.off + f * c.speed) % span - 900;
      const x = c.dir > 0 ? px : w - px;
      const cy = y + 70 + c.lane * 46;
      return /* @__PURE__ */ jsxs2("g", { transform: `translate(${x} ${cy}) scale(${c.dir} 1)`, children: [
        /* @__PURE__ */ jsx2("polygon", { points: "58,6 260,-14 260,30 58,18", fill: C.lamp, opacity: 0.13 }),
        /* @__PURE__ */ jsx2("path", { d: "M-50 18 L-50 2 Q-48 -6 -36 -8 L-22 -24 Q-18 -28 -8 -28 L22 -28 Q30 -28 34 -22 L44 -8 Q56 -6 58 4 L58 18 Z", fill: c.col }),
        /* @__PURE__ */ jsx2("path", { d: "M-18 -10 L-8 -23 L8 -23 L8 -10 Z M14 -10 L14 -23 L24 -23 L34 -10 Z", fill: "#11151d" }),
        /* @__PURE__ */ jsx2("circle", { cx: -30, cy: 19, r: 9, fill: "#0b0d12" }),
        /* @__PURE__ */ jsx2("circle", { cx: 36, cy: 19, r: 9, fill: "#0b0d12" }),
        /* @__PURE__ */ jsx2("rect", { x: 52, y: 0, width: 7, height: 6, rx: 2, fill: C.lamp }),
        /* @__PURE__ */ jsx2("rect", { x: -51, y: 0, width: 5, height: 6, rx: 2, fill: C.red })
      ] }, i);
    })
  ] });
};

// src/components/PanelBuilding.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var SIL = "#151821";
var WIN_W = 84;
var WIN_H = 62;
var Window = ({ kind, f, seed = 0, alert = 0 }) => {
  const w = WIN_W;
  const h = WIN_H;
  const id = `w${seed}`;
  let inner = null;
  if (kind === "dark") inner = /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.winDark });
  if (kind === "dim") inner = /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.winDim });
  if (kind === "lit" || kind === "curtain") {
    inner = /* @__PURE__ */ jsxs3("g", { children: [
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: rand(seed) > 0.5 ? C.warmSoft : C.warm, opacity: 0.92 }),
      kind === "curtain" && /* @__PURE__ */ jsx3("path", { d: `M0 0 H${w * 0.42} Q${w * 0.3} ${h / 2} ${w * 0.36} ${h} H0 Z`, fill: "#c98d34", opacity: 0.85 })
    ] });
  }
  if (kind === "tv") {
    const fl = 0.55 + 0.25 * Math.sin(f * 0.9) + 0.2 * Math.sin(f * 2.3 + 1);
    inner = /* @__PURE__ */ jsxs3("g", { children: [
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: "#1b2335" }),
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.tv, opacity: 0.35 * fl }),
      /* @__PURE__ */ jsx3("rect", { x: 56, y: 22, width: 22, height: 16, fill: "#cfe0ff", opacity: 0.6 + 0.4 * fl }),
      /* @__PURE__ */ jsx3("rect", { x: 64, y: 38, width: 6, height: 8, fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: "M6 62 V38 Q6 30 14 30 H34 Q42 30 42 38 V62 Z", fill: SIL }),
      /* @__PURE__ */ jsx3("circle", { cx: 26, cy: 26, r: 9, fill: SIL })
    ] });
  }
  if (kind === "kettle") {
    inner = /* @__PURE__ */ jsxs3("g", { children: [
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.warmSoft }),
      /* @__PURE__ */ jsx3("rect", { x: 0, y: 44, width: w, height: 18, fill: "#c8a24c" }),
      /* @__PURE__ */ jsx3("circle", { cx: 26, cy: 18, r: 7.5, fill: SIL }),
      /* @__PURE__ */ jsx3("circle", { cx: 21, cy: 11, r: 4.5, fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: "M17 62 L19 30 Q20 26 26 26 Q32 26 33 30 L36 62 Z", fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: `M32 33 L${46 + Math.sin(f / 9) * 2} 40`, stroke: SIL, strokeWidth: 5, strokeLinecap: "round" }),
      /* @__PURE__ */ jsx3("path", { d: "M50 44 Q50 34 58 34 Q66 34 66 44 Z", fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: "M66 38 L72 34", stroke: SIL, strokeWidth: 3 }),
      [0, 1, 2].map((i) => {
        const p = (f / 40 + i / 3) % 1;
        return /* @__PURE__ */ jsx3("circle", { cx: 73 + Math.sin(p * 6 + i) * 3, cy: 32 - p * 26, r: 2 + p * 4, fill: "#fff", opacity: 0.55 * (1 - p) }, i);
      })
    ] });
  }
  if (kind === "mark") {
    const hand = Math.sin(f / 4) * 2;
    inner = /* @__PURE__ */ jsxs3("g", { children: [
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.warmSoft }),
      /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: C.red, opacity: alert }),
      /* @__PURE__ */ jsx3("rect", { x: 10, y: 42, width: 64, height: 5, fill: SIL }),
      /* @__PURE__ */ jsx3("rect", { x: 16, y: 47, width: 4, height: 15, fill: SIL }),
      /* @__PURE__ */ jsx3("rect", { x: 64, y: 47, width: 4, height: 15, fill: SIL }),
      /* @__PURE__ */ jsx3("circle", { cx: 22, cy: 22, r: 7, fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: "M13 44 L14 33 Q15 29 22 29 Q29 29 30 33 L31 44 Z", fill: SIL }),
      /* @__PURE__ */ jsx3("circle", { cx: 60, cy: 29, r: 6, fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: "M65 25 Q71 28 68 35", stroke: SIL, strokeWidth: 3, fill: "none" }),
      /* @__PURE__ */ jsx3("path", { d: "M53 44 L54 37 Q55 34 60 34 Q65 34 66 37 L67 44 Z", fill: SIL }),
      /* @__PURE__ */ jsx3("path", { d: `M55 38 L${48 + hand} 42`, stroke: SIL, strokeWidth: 3.4, strokeLinecap: "round" })
    ] });
  }
  return /* @__PURE__ */ jsxs3("g", { children: [
    /* @__PURE__ */ jsx3("clipPath", { id, children: /* @__PURE__ */ jsx3("rect", { width: w, height: h }) }),
    /* @__PURE__ */ jsx3("g", { clipPath: `url(#${id})`, children: inner }),
    /* @__PURE__ */ jsx3("rect", { width: w, height: h, fill: "none", stroke: "#11151c", strokeWidth: 4 }),
    kind !== "tv" && kind !== "kettle" && kind !== "mark" && /* @__PURE__ */ jsx3("rect", { x: w / 2 - 1.5, y: 0, width: 3, height: h, fill: "#11151c" }),
    /* @__PURE__ */ jsx3("rect", { x: 0, y: 14, width: w, height: 3, fill: "#11151c" }),
    /* @__PURE__ */ jsx3("rect", { x: -6, y: h, width: w + 12, height: 5, fill: C.facadeHi })
  ] });
};
var BLD = { x: 170, top: 290, cols: 6, rows: 12, colW: 123, rowH: 80 };
var winPos = (row, col) => ({
  x: BLD.x + col * BLD.colW + (BLD.colW - WIN_W) / 2,
  y: BLD.top + row * BLD.rowH + 8
});
var PanelBuilding = ({ f, special, alert = 0, litBoost = 0 }) => {
  const W = BLD.cols * BLD.colW;
  const Hh = BLD.rows * BLD.rowH;
  return /* @__PURE__ */ jsxs3("g", { children: [
    /* @__PURE__ */ jsx3("rect", { x: BLD.x - 14, y: BLD.top - 30, width: W + 28, height: 30, fill: C.facadeHi }),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x + 80, y: BLD.top - 70, width: 110, height: 40, fill: C.facade }),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x + 500, y: BLD.top - 110, width: 4, height: 80, fill: C.facade }),
    /* @__PURE__ */ jsx3("circle", { cx: BLD.x + 502, cy: BLD.top - 112, r: 5, fill: C.red, opacity: Math.floor(f / 22) % 2 ? 1 : 0.2 }),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x, y: BLD.top, width: W, height: Hh, fill: C.facade }),
    Array.from({ length: BLD.rows + 1 }).map((_, r) => /* @__PURE__ */ jsx3("rect", { x: BLD.x, y: BLD.top + r * BLD.rowH - 1, width: W, height: 2, fill: C.seam }, r)),
    Array.from({ length: BLD.cols / 2 + 1 }).map((_, c) => /* @__PURE__ */ jsx3("rect", { x: BLD.x + c * BLD.colW * 2 - 1, y: BLD.top, width: 2, height: Hh, fill: C.seam }, c)),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x, y: BLD.top, width: 12, height: Hh, fill: C.facadeHi }),
    Array.from({ length: BLD.rows }).map(
      (_, r) => Array.from({ length: BLD.cols }).map((__, c) => {
        const s = rand(r * 17 + c * 3 + 5);
        const key = `${r},${c}`;
        let kind = s > 0.86 ? "curtain" : s > 0.74 ? "lit" : s > 0.5 ? "dim" : "dark";
        if (litBoost && kind === "dark" && rand(r * 7 + c + 99) < litBoost) kind = "lit";
        if (special[key]) kind = special[key];
        const p = winPos(r, c);
        return /* @__PURE__ */ jsx3("g", { transform: `translate(${p.x} ${p.y})`, children: /* @__PURE__ */ jsx3(Window, { kind, f, seed: r * 10 + c, alert: kind === "mark" ? alert : 0 }) }, key);
      })
    ),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x + 300, y: BLD.top + Hh - 70, width: 120, height: 70, fill: "#12161e" }),
    /* @__PURE__ */ jsx3("rect", { x: BLD.x + 290, y: BLD.top + Hh - 84, width: 140, height: 12, fill: C.facadeHi }),
    /* @__PURE__ */ jsx3("circle", { cx: BLD.x + 360, cy: BLD.top + Hh - 92, r: 6, fill: C.lamp }),
    /* @__PURE__ */ jsx3("circle", { cx: BLD.x + 360, cy: BLD.top + Hh - 92, r: 70, fill: "url(#lampHalo)" })
  ] });
};

// src/components/Apartment.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var ROOM = { left: 70, right: 1010, ceil: 330, floor: 1110, tableTop: 930, tableL: 330, tableR: 730 };
var MiniCity = ({ f }) => /* @__PURE__ */ jsxs4("g", { children: [
  /* @__PURE__ */ jsx4("rect", { x: 0, y: 0, width: 300, height: 340, fill: "#0c111b" }),
  Array.from({ length: 40 }).map((_, i) => /* @__PURE__ */ jsx4("circle", { cx: rand(i + 3) * 300, cy: rand(i + 8) * 200, r: 0.6 + rand(i) * 1.2, fill: "#cfd6e6", opacity: 0.3 + 0.4 * Math.abs(Math.sin(f / 25 + i)) }, i)),
  /* @__PURE__ */ jsx4("circle", { cx: 226, cy: 70, r: 22, fill: C.moon }),
  [[0, 170, 70], [60, 120, 60], [110, 200, 50], [150, 90, 70], [210, 150, 50], [250, 110, 60]].map(([x, h, w], i) => /* @__PURE__ */ jsxs4("g", { children: [
    /* @__PURE__ */ jsx4("rect", { x, y: 340 - h, width: w, height: h, fill: i % 2 ? "#151b28" : "#18202d" }),
    Array.from({ length: 8 }).map(
      (_, k) => rand(i * 9 + k) > 0.6 ? /* @__PURE__ */ jsx4("rect", { x: x + 8 + k % 3 * 16, y: 340 - h + 14 + Math.floor(k / 3) * 24, width: 8, height: 10, fill: C.warm, opacity: 0.65 }, k) : null
    )
  ] }, i)),
  /* @__PURE__ */ jsx4("rect", { x: 40, y: 60, width: 5, height: 130, fill: "#151b28" }),
  /* @__PURE__ */ jsx4("circle", { cx: 42.5, cy: 58, r: 2.5, fill: C.red, opacity: Math.floor(f / 20) % 2 ? 1 : 0.3 })
] });
var ApartmentBack = ({ f, alert = 0, lamp = 1 }) => {
  const { left, right, ceil, floor } = ROOM;
  return /* @__PURE__ */ jsxs4("g", { children: [
    /* @__PURE__ */ jsxs4("defs", { children: [
      /* @__PURE__ */ jsxs4("radialGradient", { id: "lampPool", cx: "0.5", cy: "0.35", r: "0.6", children: [
        /* @__PURE__ */ jsx4("stop", { offset: "0", stopColor: C.lamp, stopOpacity: 0.32 * lamp }),
        /* @__PURE__ */ jsx4("stop", { offset: "0.5", stopColor: C.lamp, stopOpacity: 0.1 * lamp }),
        /* @__PURE__ */ jsx4("stop", { offset: "1", stopColor: C.lamp, stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxs4("pattern", { id: "wallpaper", width: "64", height: "64", patternUnits: "userSpaceOnUse", children: [
        /* @__PURE__ */ jsx4("rect", { width: "64", height: "64", fill: C.wall }),
        /* @__PURE__ */ jsx4("rect", { x: "30", width: "4", height: "64", fill: "#30353f" }),
        /* @__PURE__ */ jsx4("circle", { cx: "12", cy: "20", r: "2.5", fill: "#31363f" }),
        /* @__PURE__ */ jsx4("circle", { cx: "52", cy: "52", r: "2.5", fill: "#31363f" })
      ] })
    ] }),
    /* @__PURE__ */ jsx4("rect", { x: -200, y: -400, width: 1480, height: 2600, fill: C.facade }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: 60, width: right - left, height: 240, fill: "#161b24" }),
    /* @__PURE__ */ jsx4("rect", { x: 140, y: 150, width: 120, height: 150, fill: "#1b202a" }),
    /* @__PURE__ */ jsx4("rect", { x: 720, y: 190, width: 180, height: 110, fill: C.winDim }),
    /* @__PURE__ */ jsx4("rect", { x: 760, y: 210, width: 60, height: 70, fill: C.warm, opacity: 0.25 }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: floor + 40, width: right - left, height: 260, fill: "#141920" }),
    /* @__PURE__ */ jsx4("rect", { x: 300, y: floor + 40, width: 6, height: 60, fill: "#1f252f" }),
    /* @__PURE__ */ jsx4("ellipse", { cx: 303, cy: floor + 112, rx: 30, ry: 14, fill: "#3a3a2c" }),
    /* @__PURE__ */ jsx4("ellipse", { cx: 303, cy: floor + 140, rx: 120, ry: 50, fill: C.lamp, opacity: 0.05 }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: ceil, width: right - left, height: floor - ceil, fill: "url(#wallpaper)" }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: floor - 26, width: right - left, height: 26, fill: "#252a33" }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: floor - 30, width: right - left, height: 5, fill: "#363c48" }),
    /* @__PURE__ */ jsxs4("g", { transform: "translate(640 430)", children: [
      /* @__PURE__ */ jsx4(MiniCity, { f }),
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 0, width: 300, height: 340, fill: C.red, opacity: alert * 0.18 }),
      /* @__PURE__ */ jsx4("rect", { x: -10, y: -10, width: 320, height: 360, fill: "none", stroke: "#1a1e26", strokeWidth: 20 }),
      /* @__PURE__ */ jsx4("rect", { x: 146, y: 0, width: 8, height: 340, fill: "#1a1e26" }),
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 110, width: 300, height: 8, fill: "#1a1e26" }),
      /* @__PURE__ */ jsx4("rect", { x: -24, y: 350, width: 348, height: 16, fill: "#3a404b" }),
      /* @__PURE__ */ jsx4("path", { d: "M250 -26 Q290 140 270 380 L340 380 L340 -26 Z", fill: "#4b3a3a" }),
      /* @__PURE__ */ jsx4("path", { d: "M262 -26 Q296 140 282 380", stroke: "#3a2c2d", strokeWidth: 6, fill: "none" })
    ] }),
    /* @__PURE__ */ jsx4("g", { transform: "translate(680 820)", children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ jsx4("rect", { x: i * 26, y: 0, width: 20, height: 90, rx: 6, fill: "#3a404b" }, i)) }),
    /* @__PURE__ */ jsxs4("g", { transform: "translate(110 470)", children: [
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 110, width: 220, height: 10, fill: C.woodHi }),
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 240, width: 220, height: 10, fill: C.woodHi }),
      Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ jsx4("rect", { x: 8 + i * 23, y: 110 - (60 + rand(i) * 34), width: 18, height: 60 + rand(i) * 34, fill: ["#5a3a34", "#3c4a5c", "#6b5a3a", "#2f3a33", "#4a3550"][i % 5] }, i)),
      Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx4("rect", { x: 10 + i * 22, y: 240 - (52 + rand(i + 20) * 30), width: 18, height: 52 + rand(i + 20) * 30, fill: ["#3c4a5c", "#5a3a34", "#2f3a33"][i % 3] }, i)),
      /* @__PURE__ */ jsx4("rect", { x: 160, y: 190, width: 44, height: 50, rx: 6, fill: "#3a404b" }),
      /* @__PURE__ */ jsx4("path", { d: "M168 190 Q182 160 196 190", fill: "#2f4a3a" })
    ] }),
    /* @__PURE__ */ jsxs4("g", { transform: "translate(360 372) rotate(-3)", children: [
      /* @__PURE__ */ jsx4("rect", { width: 150, height: 110, fill: "#e9e4d6" }),
      /* @__PURE__ */ jsx4("path", { d: "M20 90 L20 55 L55 30 L90 55 L90 90 Z", fill: "none", stroke: "#c0503f", strokeWidth: 4 }),
      /* @__PURE__ */ jsx4("circle", { cx: 120, cy: 28, r: 14, fill: C.warm }),
      /* @__PURE__ */ jsx4("path", { d: "M100 95 l8 -16 l8 16 M125 95 l6 -12 l6 12", stroke: "#3c6a4a", strokeWidth: 3, fill: "none" }),
      /* @__PURE__ */ jsx4("rect", { x: 70, y: -6, width: 14, height: 14, fill: "#d9c27a", opacity: 0.8 })
    ] }),
    /* @__PURE__ */ jsx4("rect", { x: 528, y: ceil, width: 3, height: 210, fill: "#15181e" }),
    /* @__PURE__ */ jsx4("rect", { x: left, y: ceil, width: right - left, height: floor - ceil, fill: "url(#lampPool)" }),
    /* @__PURE__ */ jsx4("rect", { x: left - 30, y: ceil - 34, width: right - left + 60, height: 34, fill: C.facadeHi }),
    /* @__PURE__ */ jsx4("rect", { x: left - 30, y: floor, width: right - left + 60, height: 40, fill: C.facadeHi }),
    /* @__PURE__ */ jsx4("rect", { x: left - 30, y: 60, width: 30, height: floor + 300, fill: C.facadeHi }),
    /* @__PURE__ */ jsx4("rect", { x: right, y: 60, width: 30, height: floor + 300, fill: C.facadeHi })
  ] });
};
var Chair = ({ x, facing, seat = 1004 }) => /* @__PURE__ */ jsxs4("g", { transform: `translate(${x} 0) scale(${facing} 1)`, children: [
  /* @__PURE__ */ jsx4("rect", { x: -50, y: seat, width: 100, height: 12, rx: 3, fill: C.woodHi }),
  /* @__PURE__ */ jsx4("rect", { x: -46, y: seat + 12, width: 8, height: ROOM.floor - seat - 12, fill: C.wood }),
  /* @__PURE__ */ jsx4("rect", { x: 38, y: seat + 12, width: 8, height: ROOM.floor - seat - 12, fill: C.wood }),
  /* @__PURE__ */ jsx4("rect", { x: -54, y: seat - 150, width: 10, height: 162, rx: 3, fill: C.wood }),
  /* @__PURE__ */ jsx4("rect", { x: -54, y: seat - 150, width: 22, height: 40, rx: 4, fill: C.woodHi })
] });
var ApartmentFront = ({ f, phone = 0, shake = 0, drawn = 1, lamp = 1, steam = 1 }) => {
  const { tableTop, tableL, tableR, floor } = ROOM;
  const jx = shake ? Math.sin(f * 2.9) * 3 * shake : 0;
  return /* @__PURE__ */ jsxs4("g", { children: [
    /* @__PURE__ */ jsx4("defs", { children: /* @__PURE__ */ jsxs4("radialGradient", { id: "phoneGlow", children: [
      /* @__PURE__ */ jsx4("stop", { offset: "0", stopColor: C.redHot, stopOpacity: 0.45 }),
      /* @__PURE__ */ jsx4("stop", { offset: "1", stopColor: C.redHot, stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsx4("path", { d: "M470 540 L590 540 L566 490 L494 490 Z", fill: "#2a2f38" }),
    /* @__PURE__ */ jsx4("ellipse", { cx: 530, cy: 542, rx: 60, ry: 8, fill: C.lamp, opacity: 0.9 * lamp }),
    /* @__PURE__ */ jsx4("polygon", { points: `470,542 590,542 ${tableR + 60},${tableTop} ${tableL - 60},${tableTop}`, fill: C.lamp, opacity: 0.07 * lamp }),
    /* @__PURE__ */ jsx4("rect", { x: tableL - 20, y: tableTop, width: tableR - tableL + 40, height: 18, rx: 4, fill: C.woodHi }),
    /* @__PURE__ */ jsx4("rect", { x: tableL - 20, y: tableTop + 18, width: tableR - tableL + 40, height: 10, fill: C.wood }),
    /* @__PURE__ */ jsx4("rect", { x: tableL, y: tableTop + 28, width: 14, height: floor - tableTop - 28, fill: C.wood }),
    /* @__PURE__ */ jsx4("rect", { x: tableR - 14, y: tableTop + 28, width: 14, height: floor - tableTop - 28, fill: C.wood }),
    /* @__PURE__ */ jsxs4("g", { transform: `translate(${tableL + 60} ${tableTop})`, children: [
      /* @__PURE__ */ jsx4("rect", { x: 0, y: -40, width: 36, height: 40, rx: 5, fill: "#d9d4c7" }),
      /* @__PURE__ */ jsx4("path", { d: "M36 -32 q14 0 14 12 q0 12 -14 12", stroke: "#d9d4c7", strokeWidth: 6, fill: "none" }),
      [0, 1, 2].map((i) => {
        const p = (f / 50 + i / 3) % 1;
        return /* @__PURE__ */ jsx4("path", { d: `M${12 + i * 6} ${-46 - p * 60} q${6 + Math.sin(p * 6) * 4} -10 0 -20`, stroke: "#fff", strokeWidth: 3, fill: "none", opacity: 0.3 * (1 - p) * steam }, i);
      })
    ] }),
    /* @__PURE__ */ jsxs4("g", { transform: `translate(${tableL + 150 + jx} ${tableTop - 6})`, children: [
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 0, width: 70, height: 8, rx: 3, fill: "#0d0f14" }),
      /* @__PURE__ */ jsx4("rect", { x: 4, y: -2, width: 62, height: 4, rx: 2, fill: phone ? C.redHot : "#1c2230", opacity: phone ? 0.6 + 0.4 * phone : 1 }),
      phone > 0 && /* @__PURE__ */ jsx4("ellipse", { cx: 35, cy: -20, rx: 110, ry: 70, fill: "url(#phoneGlow)", opacity: phone })
    ] }),
    /* @__PURE__ */ jsxs4("g", { transform: `translate(${tableR - 170} ${tableTop - 4})`, children: [
      /* @__PURE__ */ jsx4("polygon", { points: "0,4 120,4 128,0 8,0", fill: "#e9e4d6" }),
      /* @__PURE__ */ jsx4("rect", { x: 20, y: -1, width: 80 * drawn, height: 2, fill: "#6a6f7a", opacity: 0.8 }),
      /* @__PURE__ */ jsx4("rect", { x: -30, y: -2, width: 26, height: 4, fill: C.red }),
      /* @__PURE__ */ jsx4("rect", { x: -62, y: -2, width: 26, height: 4, fill: "#3c6a4a" })
    ] }),
    /* @__PURE__ */ jsxs4("g", { transform: `translate(${tableR - 20 - jx} ${tableTop - 6})`, children: [
      /* @__PURE__ */ jsx4("rect", { x: 0, y: 0, width: 56, height: 7, rx: 2, fill: "#0d0f14" }),
      phone > 0 && /* @__PURE__ */ jsx4("ellipse", { cx: 28, cy: -18, rx: 90, ry: 60, fill: "url(#phoneGlow)", opacity: phone * 0.8 })
    ] })
  ] });
};

// src/components/Section.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var SEC = { left: 40, right: 1040, top: 120, floorH: 250, floors: 7, stairL: 720, stairR: 1020 };
var floorY = (i) => SEC.top + (i + 1) * SEC.floorH;
var Flight = ({ x0, y0, x1, y1, front }) => {
  const n = 9;
  const steps = Array.from({ length: n }).map((_, i) => {
    const sx = x0 + (x1 - x0) * i / n;
    const sy = y0 + (y1 - y0) * i / n;
    const w = (x1 - x0) / n;
    const h = (y1 - y0) / n;
    return `L${sx} ${sy + h} L${sx + w} ${sy + h}`;
  });
  const d = `M${x0} ${y0} ${steps.join(" ")} L${x1} ${y1 + 26} L${x0} ${y0 + 26} Z`;
  return /* @__PURE__ */ jsxs5("g", { opacity: front ? 1 : 0.55, children: [
    /* @__PURE__ */ jsx5("path", { d, fill: front ? "#3a414e" : "#2a303a" }),
    /* @__PURE__ */ jsx5("path", { d: `M${x0} ${y0 - 70} L${x1} ${y1 - 70}`, stroke: front ? "#555d6b" : "#3a404b", strokeWidth: 5 }),
    Array.from({ length: 5 }).map((_, i) => {
      const k = (i + 0.5) / 5;
      const x = x0 + (x1 - x0) * k;
      const y = y0 + (y1 - y0) * k;
      return /* @__PURE__ */ jsx5("rect", { x: x - 1.5, y: y - 70, width: 3, height: 70, fill: front ? "#4a515e" : "#343a45" }, i);
    })
  ] });
};
var Apartment = ({ x, y, w, seed, f, lit, flicker }) => {
  const h = SEC.floorH - 30;
  const warm = rand(seed) > 0.35;
  return /* @__PURE__ */ jsxs5("g", { children: [
    /* @__PURE__ */ jsx5("rect", { x, y: y - h, width: w, height: h, fill: warm ? "#2f3036" : "#272c36" }),
    /* @__PURE__ */ jsx5("rect", { x: x + w * 0.3, y: y - h + 40, width: w * 0.34, height: 90, fill: "#0f141d" }),
    /* @__PURE__ */ jsx5("rect", { x: x + w * 0.3 + w * 0.17 - 2, y: y - h + 40, width: 4, height: 90, fill: "#1a1e26" }),
    rand(seed + 1) > 0.5 ? /* @__PURE__ */ jsxs5("g", { fill: "#1c2028", children: [
      /* @__PURE__ */ jsx5("rect", { x: x + 30, y: y - 70, width: 110, height: 40, rx: 8 }),
      /* @__PURE__ */ jsx5("rect", { x: x + 30, y: y - 96, width: 30, height: 66, rx: 8 })
    ] }) : /* @__PURE__ */ jsxs5("g", { fill: "#1c2028", children: [
      /* @__PURE__ */ jsx5("rect", { x: x + w - 160, y: y - 60, width: 100, height: 8 }),
      /* @__PURE__ */ jsx5("rect", { x: x + w - 150, y: y - 52, width: 6, height: 52 }),
      /* @__PURE__ */ jsx5("rect", { x: x + w - 72, y: y - 52, width: 6, height: 52 })
    ] }),
    /* @__PURE__ */ jsx5("rect", { x: x + w / 2, y: y - h, width: 2, height: 40, fill: "#15181e" }),
    /* @__PURE__ */ jsx5("circle", { cx: x + w / 2 + 1, cy: y - h + 46, r: 7, fill: C.lamp, opacity: lit * flicker }),
    /* @__PURE__ */ jsx5("rect", { x, y: y - h, width: w, height: h, fill: C.lamp, opacity: (warm ? 0.09 : 0.04) * lit * flicker }),
    /* @__PURE__ */ jsx5("rect", { x: x + w - 46, y: y - 150, width: 40, height: 150, fill: "#3b2f2c" }),
    /* @__PURE__ */ jsx5("circle", { cx: x + w - 14, cy: y - 76, r: 3, fill: C.warm, opacity: 0.7 }),
    /* @__PURE__ */ jsx5("text", { x: x + w - 26, y: y - 160, fill: "#8a909b", fontSize: 16, fontWeight: 800, textAnchor: "middle", fontFamily: "Montserrat", children: seed + 40 })
  ] });
};
var BuildingSection = ({ f, lights = 1, children, front }) => {
  const { left, right, top, floorH, floors, stairL, stairR } = SEC;
  return /* @__PURE__ */ jsxs5("g", { children: [
    /* @__PURE__ */ jsx5("rect", { x: -600, y: -600, width: 2400, height: 3600, fill: C.facade }),
    /* @__PURE__ */ jsx5("rect", { x: left, y: top, width: right - left, height: floorH * floors, fill: "#20252e" }),
    /* @__PURE__ */ jsx5("rect", { x: stairL, y: top, width: stairR - stairL, height: floorH * floors, fill: "#262b34" }),
    Array.from({ length: floors }).map((_, i) => {
      const y = floorY(i);
      const fl = lights * (0.85 + 0.15 * Math.sin(f / 7 + i));
      return /* @__PURE__ */ jsxs5("g", { children: [
        /* @__PURE__ */ jsx5(Apartment, { x: left + 10, y, w: 320, seed: i * 2 + 1, f, lit: rand(i + 3) > 0.2 ? 1 : 0.2, flicker: lights }),
        /* @__PURE__ */ jsx5(Apartment, { x: left + 345, y, w: 320, seed: i * 2 + 2, f, lit: rand(i + 9) > 0.3 ? 1 : 0.2, flicker: lights }),
        /* @__PURE__ */ jsx5("rect", { x: stairL, y, width: stairR - stairL, height: 8, fill: "#3a414e" }),
        /* @__PURE__ */ jsx5("rect", { x: stairL, y: y + floorH / 2, width: 90, height: 8, fill: "#2e343f" }),
        /* @__PURE__ */ jsx5(Flight, { x0: stairR - 40, y0: y, x1: stairL + 40, y1: y + floorH / 2, front: false }),
        /* @__PURE__ */ jsx5("rect", { x: stairL + 140, y: y + 40, width: 70, height: 90, fill: "#0d121b" }),
        /* @__PURE__ */ jsx5("rect", { x: stairL + 174, y: y + 40, width: 3, height: 90, fill: "#1a1e26" }),
        /* @__PURE__ */ jsx5("circle", { cx: stairR - 60, cy: y - floorH + 50, r: 8, fill: C.lamp, opacity: fl }),
        /* @__PURE__ */ jsx5("circle", { cx: stairR - 60, cy: y - floorH + 50, r: 70, fill: "url(#bulbHalo)", opacity: fl }),
        /* @__PURE__ */ jsx5("text", { x: stairL + 20, y: y - floorH + 60, fill: "#6a707c", fontSize: 30, fontWeight: 900, fontFamily: "Montserrat", children: floors + 2 - i })
      ] }, i);
    }),
    /* @__PURE__ */ jsx5("defs", { children: /* @__PURE__ */ jsxs5("radialGradient", { id: "bulbHalo", children: [
      /* @__PURE__ */ jsx5("stop", { offset: "0", stopColor: C.lamp, stopOpacity: 0.3 }),
      /* @__PURE__ */ jsx5("stop", { offset: "1", stopColor: C.lamp, stopOpacity: 0 })
    ] }) }),
    children,
    Array.from({ length: floors }).map((_, i) => {
      const y = floorY(i);
      return /* @__PURE__ */ jsx5(Flight, { x0: stairL + 40, y0: y + floorH / 2, x1: stairR - 40, y1: y + floorH, front: true }, i);
    }),
    front,
    Array.from({ length: floors + 1 }).map((_, i) => /* @__PURE__ */ jsx5("rect", { x: left - 30, y: top + i * floorH - 4, width: right - left + 60, height: 26, fill: C.facadeHi }, i)),
    /* @__PURE__ */ jsx5("rect", { x: left - 30, y: top, width: 30, height: floorH * floors, fill: C.facadeHi }),
    /* @__PURE__ */ jsx5("rect", { x: right, y: top, width: 30, height: floorH * floors, fill: C.facadeHi }),
    /* @__PURE__ */ jsx5("rect", { x: stairL - 12, y: top, width: 12, height: floorH * floors, fill: C.facadeHi }),
    /* @__PURE__ */ jsx5("rect", { x: -600, y: -600, width: 2400, height: 3600, fill: "#000", opacity: (1 - lights) * 0.75 })
  ] });
};

// src/components/Shelter.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var SH = { left: -260, right: 1340, ceil: 330, floor: 1110, door: { x: -150, w: 230 }, table: { x: 800, w: 270, top: 930 }, monitor: { x: 1270, y: 760 } };
var Lamp = ({ x, y, on, color }) => /* @__PURE__ */ jsxs6("g", { children: [
  /* @__PURE__ */ jsx6("circle", { cx: x, cy: y, r: 170, fill: `url(#shLampHalo${color === C.lamp ? "Y" : "R"})`, opacity: on }),
  /* @__PURE__ */ jsx6("rect", { x: x - 22, y: y - 30, width: 44, height: 10, fill: "#1d2129" }),
  /* @__PURE__ */ jsx6("ellipse", { cx: x, cy: y, rx: 18, ry: 16, fill: on > 0.05 ? color : "#2a2e35", opacity: 0.4 + 0.6 * on }),
  /* @__PURE__ */ jsxs6("g", { stroke: "#14171c", strokeWidth: 3, fill: "none", children: [
    /* @__PURE__ */ jsx6("ellipse", { cx: x, cy: y, rx: 20, ry: 18 }),
    /* @__PURE__ */ jsx6("path", { d: `M${x - 20} ${y} H${x + 20} M${x} ${y - 18} V${y + 18}` })
  ] })
] });
var ShelterBack = ({ f, light: light2, doorShake = 0 }) => {
  const { left, right, ceil, floor, door } = SH;
  const dj = doorShake ? Math.sin(f * 3.3) * 3 * doorShake : 0;
  return /* @__PURE__ */ jsxs6("g", { children: [
    /* @__PURE__ */ jsxs6("defs", { children: [
      /* @__PURE__ */ jsxs6("radialGradient", { id: "shLampHaloY", children: [
        /* @__PURE__ */ jsx6("stop", { offset: "0", stopColor: C.lamp, stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx6("stop", { offset: "1", stopColor: C.lamp, stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxs6("radialGradient", { id: "shLampHaloR", children: [
        /* @__PURE__ */ jsx6("stop", { offset: "0", stopColor: C.redHot, stopOpacity: 0.4 }),
        /* @__PURE__ */ jsx6("stop", { offset: "1", stopColor: C.redHot, stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxs6("pattern", { id: "concrete", width: "160", height: "120", patternUnits: "userSpaceOnUse", children: [
        /* @__PURE__ */ jsx6("rect", { width: "160", height: "120", fill: "#262b33" }),
        /* @__PURE__ */ jsx6("rect", { width: "160", height: "2", fill: "#1f232a" }),
        /* @__PURE__ */ jsx6("rect", { width: "2", height: "120", fill: "#1f232a" }),
        /* @__PURE__ */ jsx6("circle", { cx: "40", cy: "30", r: "2", fill: "#2c3139" }),
        /* @__PURE__ */ jsx6("circle", { cx: "120", cy: "90", r: "2", fill: "#2c3139" })
      ] })
    ] }),
    /* @__PURE__ */ jsx6("rect", { x: -1200, y: -800, width: 3600, height: 3600, fill: C.facade }),
    /* @__PURE__ */ jsx6("rect", { x: -1200, y: ceil - 220, width: 3600, height: 190, fill: "#141922" }),
    /* @__PURE__ */ jsx6("rect", { x: -1200, y: ceil - 34, width: 3600, height: 34, fill: C.facadeHi }),
    /* @__PURE__ */ jsx6("rect", { x: left, y: ceil, width: right - left, height: floor - ceil, fill: "url(#concrete)" }),
    /* @__PURE__ */ jsx6("rect", { x: left, y: floor - 60, width: right - left, height: 60, fill: "#20252c" }),
    /* @__PURE__ */ jsx6("rect", { x: left, y: ceil + 30, width: right - left, height: 26, rx: 13, fill: "#363c46" }),
    /* @__PURE__ */ jsx6("rect", { x: left, y: ceil + 66, width: right - left, height: 14, rx: 7, fill: "#2e333c" }),
    Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ jsx6("rect", { x: left + 80 + i * 180, y: ceil + 26, width: 14, height: 34, fill: "#2a2f37" }, i)),
    /* @__PURE__ */ jsxs6("g", { transform: `translate(${door.x + dj} 0)`, children: [
      /* @__PURE__ */ jsx6("rect", { x: -14, y: floor - 470, width: door.w + 28, height: 470, fill: "#1b1f26" }),
      /* @__PURE__ */ jsx6("rect", { x: 0, y: floor - 456, width: door.w, height: 456, rx: 8, fill: "#3b4048" }),
      /* @__PURE__ */ jsx6("rect", { x: 14, y: floor - 440, width: door.w - 28, height: 424, rx: 6, fill: "none", stroke: "#2e333a", strokeWidth: 6 }),
      /* @__PURE__ */ jsx6("circle", { cx: door.w / 2, cy: floor - 230, r: 46, fill: "none", stroke: "#5a606a", strokeWidth: 8 }),
      /* @__PURE__ */ jsx6("path", { d: `M${door.w / 2 - 46} ${floor - 230} H${door.w / 2 + 46} M${door.w / 2} ${floor - 276} V${floor - 184}`, stroke: "#5a606a", strokeWidth: 6 }),
      Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx6("rect", { x: door.w - 16, y: floor - 400 + i * 110, width: 18, height: 30, rx: 4, fill: "#2c3036" }, i))
    ] }),
    /* @__PURE__ */ jsxs6("g", { transform: `translate(${door.x + door.w / 2} ${floor - 520})`, children: [
      /* @__PURE__ */ jsx6("rect", { x: -130, y: -26, width: 260, height: 52, rx: 6, fill: "#d9d4c7" }),
      /* @__PURE__ */ jsx6("text", { x: 0, y: 10, textAnchor: "middle", fontFamily: "Montserrat", fontWeight: 900, fontSize: 28, fill: "#2a2e35", children: "\u0423\u0411\u0415\u0416\u0418\u0429\u0415 \u2116 17" })
    ] }),
    /* @__PURE__ */ jsxs6("g", { transform: "translate(560 420)", children: [
      /* @__PURE__ */ jsx6("rect", { x: -8, y: -30, width: 16, height: 30, fill: "#1d2129" }),
      /* @__PURE__ */ jsx6("path", { d: "M-30 0 L30 0 L54 54 L-54 54 Z", fill: "#3a3f48" }),
      /* @__PURE__ */ jsx6("ellipse", { cx: 0, cy: 54, rx: 54, ry: 12, fill: "#15181d" })
    ] }),
    [[120, 520], [700, 380]].map(([x, w], i) => /* @__PURE__ */ jsxs6("g", { children: [
      /* @__PURE__ */ jsx6("rect", { x, y: floor - 150, width: w, height: 14, rx: 4, fill: "#3a3230" }),
      /* @__PURE__ */ jsx6("rect", { x: x + 10, y: floor - 136, width: 10, height: 76, fill: "#2a2422" }),
      /* @__PURE__ */ jsx6("rect", { x: x + w - 20, y: floor - 136, width: 10, height: 76, fill: "#2a2422" })
    ] }, i)),
    /* @__PURE__ */ jsxs6("g", { transform: "translate(380 520)", children: [
      /* @__PURE__ */ jsx6("rect", { width: 110, height: 70, fill: "#1f232a" }),
      Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx6("rect", { x: 8, y: 8 + i * 10, width: 94, height: 4, fill: "#2e333b" }, i))
    ] }),
    /* @__PURE__ */ jsxs6("g", { transform: "translate(1260 900)", children: [
      /* @__PURE__ */ jsx6("rect", { x: 0, y: 0, width: 34, height: 90, rx: 14, fill: "#8a2e2a" }),
      /* @__PURE__ */ jsx6("rect", { x: 8, y: -16, width: 18, height: 18, fill: "#1c1f24" })
    ] }),
    /* @__PURE__ */ jsx6(Lamp, { x: 300, y: ceil + 140, on: light2.lamps * (0.9 + 0.1 * Math.sin(f / 5)), color: C.lamp }),
    /* @__PURE__ */ jsx6(Lamp, { x: 820, y: ceil + 140, on: light2.lamps * (0.92 + 0.08 * Math.sin(f / 6 + 2)), color: C.lamp }),
    /* @__PURE__ */ jsx6(Lamp, { x: 1160, y: ceil + 140, on: light2.lamps, color: C.lamp }),
    /* @__PURE__ */ jsx6(Lamp, { x: 560, y: ceil + 110, on: light2.red * (0.7 + 0.3 * Math.sin(f / 9)), color: C.redHot })
  ] });
};
var Piece = ({ x, y, k, white, s = 1 }) => {
  const c = white ? "#e6e0d2" : "#15181d";
  const top = { p: /* @__PURE__ */ jsx6("circle", { cx: 0, cy: -26, r: 7 }), k: /* @__PURE__ */ jsx6("path", { d: "M-2 -46 h4 v6 h6 v4 h-6 v6 h-4 v-6 h-6 v-4 h6 Z" }), q: /* @__PURE__ */ jsx6("circle", { cx: 0, cy: -36, r: 6 }), n: /* @__PURE__ */ jsx6("path", { d: "M-8 -20 L-6 -40 L8 -34 L6 -26 L2 -28 L4 -20 Z" }), r: /* @__PURE__ */ jsx6("rect", { x: -8, y: -34, width: 16, height: 12 }) }[k];
  return /* @__PURE__ */ jsxs6("g", { transform: `translate(${x} ${y}) scale(${s})`, fill: c, children: [
    /* @__PURE__ */ jsx6("path", { d: "M-11 0 L11 0 L8 -6 L-8 -6 Z" }),
    /* @__PURE__ */ jsx6("path", { d: k === "p" ? "M-5 -6 L5 -6 L3 -20 L-3 -20 Z" : "M-6 -6 L6 -6 L4 -30 L-4 -30 Z" }),
    top
  ] });
};
var ChessSide = ({ x, y, moveT = 0 }) => /* @__PURE__ */ jsxs6("g", { transform: `translate(${x} ${y})`, children: [
  /* @__PURE__ */ jsx6("polygon", { points: "-110,0 110,0 96,-16 -96,-16", fill: "#4a3f36" }),
  Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx6("polygon", { points: `${-96 + i * 24},-16 ${-96 + (i + 1) * 24},-16 ${-110 + (i + 1) * 27.5},0 ${-110 + i * 27.5},0`, fill: i % 2 ? "#c9bea8" : "#5a4a3c" }, i)),
  /* @__PURE__ */ jsx6("rect", { x: -110, y: 0, width: 220, height: 8, fill: "#2e2620" }),
  [-80, -50, -20, 30, 60].map((px, i) => /* @__PURE__ */ jsx6(Piece, { x: px, y: -8, k: ["r", "p", "k", "p", "q"][i], white: false, s: 0.7 }, i)),
  [-66, 6, 44].map((px, i) => /* @__PURE__ */ jsx6(Piece, { x: px, y: -4, k: ["p", "p", "r"][i], white: true, s: 0.8 }, i)),
  /* @__PURE__ */ jsx6(Piece, { x: -30 + moveT * 50, y: -4 - Math.sin(moveT * Math.PI) * 24, k: "n", white: true, s: 0.8 })
] });
var ChessCloseup = ({ moveT }) => {
  const sq = 96;
  const ox = 540 - sq * 4;
  const oy = 380;
  const sk = (x, y) => [ox + x * sq * (0.86 + y / 8 * 0.14) + (1 - (0.86 + y / 8 * 0.14)) * sq * 4, oy + y * sq * 0.62];
  const pieces = [
    [0, 1, "r", false],
    [4, 0, "k", false],
    [3, 1, "q", false],
    [5, 2, "p", false],
    [6, 2, "p", false],
    [2, 3, "p", false],
    [3, 4, "p", true],
    [4, 5, "p", true],
    [6, 6, "p", true],
    [4, 7, "k", true],
    [7, 7, "r", true]
  ];
  const [nx0, ny0] = sk(2.5, 6.5);
  const [nx1, ny1] = sk(3.5, 4.5);
  const nx = nx0 + (nx1 - nx0) * moveT;
  const ny = ny0 + (ny1 - ny0) * moveT - Math.sin(moveT * Math.PI) * 60;
  return /* @__PURE__ */ jsxs6("g", { children: [
    /* @__PURE__ */ jsx6("rect", { x: 0, y: 0, width: 1080, height: 1300, fill: "#1a1d22" }),
    /* @__PURE__ */ jsx6("rect", { x: 0, y: 0, width: 1080, height: 1300, fill: C.lamp, opacity: 0.05 }),
    Array.from({ length: 8 }).map(
      (_, y) => Array.from({ length: 8 }).map((__, x) => {
        const [a, b] = sk(x, y);
        const [c, d] = sk(x + 1, y);
        const [e, g] = sk(x + 1, y + 1);
        const [h, i] = sk(x, y + 1);
        return /* @__PURE__ */ jsx6("polygon", { points: `${a},${b} ${c},${d} ${e},${g} ${h},${i}`, fill: (x + y) % 2 ? "#5a4a3c" : "#c9bea8" }, `${x}${y}`);
      })
    ),
    pieces.map(([x, y, k, w], i) => {
      const [px, py] = sk(x + 0.5, y + 0.5);
      return /* @__PURE__ */ jsx6(Piece, { x: px, y: py + 20, k, white: w, s: 1.9 + y * 0.08 }, i);
    }),
    /* @__PURE__ */ jsx6(Piece, { x: nx, y: ny + 20, k: "n", white: true, s: 2.3 }),
    moveT < 1 && /* @__PURE__ */ jsxs6("g", { transform: `translate(${nx + 26} ${ny - 64})`, children: [
      /* @__PURE__ */ jsx6("path", { d: "M-10 -10 C30 -60 120 -170 260 -420 L380 -360 C250 -160 120 -40 40 30 Z", fill: "#2c3834" }),
      /* @__PURE__ */ jsx6("path", { d: "M-10 -10 C30 -60 120 -170 260 -420 L290 -405 C160 -170 60 -50 10 10 Z", fill: "#202a27" }),
      /* @__PURE__ */ jsx6("path", { d: "M-30 6 C-34 -22 -6 -38 22 -30 C46 -22 52 8 34 30 C18 46 -20 40 -30 6 Z", fill: "#b98e78" }),
      /* @__PURE__ */ jsx6("path", { d: "M-34 10 C-46 18 -50 34 -38 40 C-28 44 -20 34 -18 26", fill: "#93705f" }),
      /* @__PURE__ */ jsx6("path", { d: "M-14 34 C-18 52 -8 60 2 54", stroke: "#93705f", strokeWidth: 9, strokeLinecap: "round", fill: "none" })
    ] })
  ] });
};
var ShelterFront = ({ f, light: light2, chessT = 0, monitorOn = 0 }) => {
  const { table, floor, monitor } = SH;
  const noise = 0.85 + 0.15 * Math.sin(f * 1.7);
  return /* @__PURE__ */ jsxs6("g", { children: [
    /* @__PURE__ */ jsx6("rect", { x: table.x, y: table.top, width: table.w, height: 16, rx: 3, fill: "#4a3f3a" }),
    /* @__PURE__ */ jsx6("rect", { x: table.x + 14, y: table.top + 16, width: 12, height: floor - table.top - 16, fill: "#3a3230" }),
    /* @__PURE__ */ jsx6("rect", { x: table.x + table.w - 26, y: table.top + 16, width: 12, height: floor - table.top - 16, fill: "#3a3230" }),
    /* @__PURE__ */ jsx6(ChessSide, { x: table.x + 140, y: table.top, moveT: chessT }),
    /* @__PURE__ */ jsxs6("g", { transform: `translate(${monitor.x} ${monitor.y})`, children: [
      /* @__PURE__ */ jsx6("rect", { x: -10, y: 70, width: 20, height: floor - monitor.y - 70, fill: "#1d2129" }),
      /* @__PURE__ */ jsx6("rect", { x: -80, y: -60, width: 160, height: 130, rx: 12, fill: "#1b1e24" }),
      /* @__PURE__ */ jsx6("rect", { x: -66, y: -48, width: 132, height: 100, rx: 8, fill: monitorOn ? "#9fb3a6" : "#0d1013", opacity: monitorOn ? 0.35 + 0.65 * monitorOn * noise : 1 }),
      monitorOn > 0 && /* @__PURE__ */ jsx6("circle", { cx: 0, cy: 0, r: 160, fill: "#9fb3a6", opacity: 0.12 * monitorOn }),
      /* @__PURE__ */ jsx6("circle", { cx: 58, cy: 60, r: 3, fill: monitorOn ? C.red : "#333" })
    ] }),
    /* @__PURE__ */ jsx6("rect", { x: -1200, y: -800, width: 3600, height: 3600, fill: "#05070b", opacity: 0.55 * (1 - Math.max(light2.lamps, light2.red * 0.7, monitorOn * 0.4)) }),
    /* @__PURE__ */ jsx6("rect", { x: -1200, y: -800, width: 3600, height: 3600, fill: C.redHot, opacity: 0.08 * light2.red, style: { mixBlendMode: "screen" } })
  ] });
};
var Cage = ({ x, y, f, flap = 0, s = 1 }) => {
  const w = Math.sin(flap) * 18;
  const bob = Math.sin(f / 6) * 2;
  return /* @__PURE__ */ jsxs6("g", { transform: `translate(${x} ${y}) scale(${s})`, children: [
    /* @__PURE__ */ jsx6("path", { d: "M-50 0 L-50 -90 Q-50 -140 0 -140 Q50 -140 50 -90 L50 0 Z", fill: "#000", opacity: 0.15 }),
    /* @__PURE__ */ jsxs6("g", { transform: `translate(0 ${-30 + bob})`, children: [
      /* @__PURE__ */ jsx6("rect", { x: -26, y: 4, width: 52, height: 4, fill: "#8a7a5a" }),
      /* @__PURE__ */ jsx6("path", { d: "M-12 4 Q-16 -30 0 -40 Q16 -30 12 4 Z", fill: "#4f8a6a" }),
      /* @__PURE__ */ jsx6("path", { d: `M-10 -24 Q${-30 - w} ${-14 - w} -14 0 Z`, fill: "#3c6f55" }),
      /* @__PURE__ */ jsx6("path", { d: `M10 -24 Q${30 + w} ${-14 - w} 14 0 Z`, fill: "#3c6f55" }),
      /* @__PURE__ */ jsx6("circle", { cx: 0, cy: -44, r: 11, fill: "#5a9a76" }),
      /* @__PURE__ */ jsx6("path", { d: "M6 -46 Q16 -44 10 -36 Z", fill: C.warm }),
      /* @__PURE__ */ jsx6("circle", { cx: 2, cy: -47, r: 2, fill: "#111" }),
      /* @__PURE__ */ jsx6("path", { d: "M-2 4 L-6 22 M2 4 L6 22", stroke: "#c9a03a", strokeWidth: 3 }),
      /* @__PURE__ */ jsx6("path", { d: "M-4 4 L-10 30 L2 30 Z", fill: "#c0503f" })
    ] }),
    /* @__PURE__ */ jsxs6("g", { stroke: "#c9b98a", strokeWidth: 2.5, fill: "none", children: [
      Array.from({ length: 9 }).map((_, i) => {
        const xx = -50 + i * 12.5;
        return /* @__PURE__ */ jsx6("path", { d: `M${xx} 0 L${xx} -90 Q${xx} ${-130 + Math.abs(xx) * 0.3} 0 -140` }, i);
      }),
      /* @__PURE__ */ jsx6("path", { d: "M-50 -90 H50 M-50 -45 H50" }),
      /* @__PURE__ */ jsx6("path", { d: "M-8 -140 Q0 -160 8 -140", strokeWidth: 4 })
    ] }),
    /* @__PURE__ */ jsx6("rect", { x: -56, y: -4, width: 112, height: 10, rx: 3, fill: "#a08a5a" })
  ] });
};
var EXTRAS = Array.from({ length: 7 }).map((_, i) => ({
  x: [170, 270, 380, 520, 740, 860, 990][i],
  facing: rand(i + 4) > 0.5 ? 1 : -1,
  top: ["#3a4a3e", "#4a3a48", "#2f3a4a", "#4a4236", "#36404a", "#4a3434", "#3a3a44"][i],
  hair: ["#1a1a1a", "#5a4030", "#9a9a9a", "#2a1a14", "#151515", "#6b5a40", "#202020"][i],
  style: ["mark", "galina", "lev", "alisa", "mark", "lev", "galina"][i],
  scale: 0.86 + rand(i + 9) * 0.12
}));

// tools/svg/export.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var out = path.resolve(process.argv[2] ?? "../output/svg");
fs.mkdirSync(out, { recursive: true });
var save = (name, w, h, el, vb = `0 0 ${w} ${h}`) => {
  const svg = renderToStaticMarkup(/* @__PURE__ */ jsx7("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: vb, width: w, height: h, children: el }));
  fs.writeFileSync(path.join(out, name + ".svg"), svg);
  console.log(name);
};
var whos = ["mark", "alisa", "galina", "lev"];
for (const w of whos) {
  save(`character_${w}`, 400, 520, /* @__PURE__ */ jsx7(Character, { who: w, x: 200, y: 500, size: w === "alisa" ? 1.35 : 1.25 }));
  save(`character_${w}_sitting`, 400, 420, /* @__PURE__ */ jsx7(Character, { who: w, x: 170, y: 400, size: 1.2, pose: { sit: 1, armF: [62, -58] } }));
}
save("city_night", 1080, 1920, /* @__PURE__ */ jsxs7("g", { children: [
  /* @__PURE__ */ jsx7(Sky, { f: 0 }),
  /* @__PURE__ */ jsx7(FarSkyline, { f: 0, base: 1180 }),
  /* @__PURE__ */ jsx7(MidTowers, { f: 0, base: 1250 }),
  /* @__PURE__ */ jsx7(PanelBuilding, { f: 0, special: { "4,1": "tv", "5,4": "kettle", "6,3": "mark" } }),
  /* @__PURE__ */ jsx7(Street, { f: 0, y: BLD.top + BLD.rows * BLD.rowH })
] }));
save("apartment_mark", 1080, 1920, /* @__PURE__ */ jsxs7("g", { children: [
  /* @__PURE__ */ jsx7(ApartmentBack, { f: 0 }),
  /* @__PURE__ */ jsx7(Chair, { x: 220, facing: 1 }),
  /* @__PURE__ */ jsx7(Chair, { x: 830, facing: -1 }),
  /* @__PURE__ */ jsx7(ApartmentFront, { f: 0 })
] }));
save("stairwell_section", 1080, 1920, /* @__PURE__ */ jsx7(BuildingSection, { f: 0 }));
var light = { lamps: 1, red: 0, monitor: 0 };
save("shelter_17", 1600, 1300, /* @__PURE__ */ jsxs7("g", { transform: "translate(260 -60)", children: [
  /* @__PURE__ */ jsx7(ShelterBack, { f: 0, light }),
  /* @__PURE__ */ jsx7(ShelterFront, { f: 0, light })
] }));
save("shelter_17_red", 1600, 1300, /* @__PURE__ */ jsxs7("g", { transform: "translate(260 -60)", children: [
  /* @__PURE__ */ jsx7(ShelterBack, { f: 0, light: { lamps: 0, red: 1, monitor: 0 } }),
  /* @__PURE__ */ jsx7(ShelterFront, { f: 0, light: { lamps: 0, red: 1, monitor: 0 }, monitorOn: 1 })
] }));
save("chess_closeup", 1080, 1300, /* @__PURE__ */ jsx7(ChessCloseup, { f: 0, moveT: 0.5 }));
save("parrot_cage", 240, 320, /* @__PURE__ */ jsxs7("g", { children: [
  /* @__PURE__ */ jsx7("rect", { width: 240, height: 320, fill: C.bg }),
  /* @__PURE__ */ jsx7(Cage, { x: 120, y: 300, f: 0, s: 1.5 })
] }));
