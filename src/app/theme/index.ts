import { createContext, useContext } from "react";

// ─── Theme System ─────────────────────────────────────────────────────────────

export type Theme = "cosmos" | "aurora" | "midnight";

export interface ThemeConfig {
  mode: "dark" | "light";
  bgBase: string;
  panelBg: string; headerBg: string; modalBg: string; pageFade: string; dotBorder: string;
  orb1: string; orb2: string; orb3: string;
  logoFrom: string; logoTo: string; logoGlow: string;
  bar1: string; bar2: string; bar3: string;
  glow1: string; glow2: string; glow3: string;
  rentGrad: string; priceGrad: string;
  ctaBlue: string; ctaTeal: string; ctaPurple: string;
  accentA: string;
}

export const THEMES: Record<Theme, ThemeConfig> = {
  cosmos: {
    mode: "dark",
    bgBase: "#030308",
    panelBg: "rgba(9,9,15,0.90)", headerBg: "rgba(3,3,8,0.40)", modalBg: "#0d0d14", pageFade: "#030308", dotBorder: "#09090f",
    orb1: "rgba(37,99,235,0.20)", orb2: "rgba(147,51,234,0.20)", orb3: "rgba(20,184,166,0.10)",
    logoFrom: "#2dd4bf", logoTo: "#2563eb", logoGlow: "rgba(45,212,191,0.30)",
    bar1: "linear-gradient(to bottom,#60a5fa,#9333ea)",
    bar2: "linear-gradient(to bottom,#2dd4bf,#059669)",
    bar3: "linear-gradient(to bottom,#c084fc,#d946ef)",
    glow1: "rgba(96,165,250,0.50)", glow2: "rgba(45,212,191,0.50)", glow3: "rgba(192,132,252,0.50)",
    rentGrad: "linear-gradient(to right,#60a5fa,#a855f7)",
    priceGrad: "linear-gradient(to right,#2dd4bf,#60a5fa)",
    ctaBlue: "linear-gradient(to right,#3b82f6,#9333ea)",
    ctaTeal: "linear-gradient(to right,#14b8a6,#059669)",
    ctaPurple: "linear-gradient(to right,#a855f7,#d946ef)",
    accentA: "#2dd4bf",
  },
  // Aurora — the app's LIGHT theme: white surfaces, near-black text, green accents.
  aurora: {
    mode: "light",
    bgBase: "#eef4ef",
    panelBg: "rgba(255,255,255,0.94)", headerBg: "rgba(238,244,239,0.70)", modalBg: "#ffffff", pageFade: "#eef4ef", dotBorder: "#ffffff",
    orb1: "rgba(16,185,129,0.16)", orb2: "rgba(34,197,94,0.14)", orb3: "rgba(132,204,22,0.10)",
    logoFrom: "#22c55e", logoTo: "#15803d", logoGlow: "rgba(34,197,94,0.30)",
    bar1: "linear-gradient(to bottom,#22c55e,#15803d)",
    bar2: "linear-gradient(to bottom,#4ade80,#16a34a)",
    bar3: "linear-gradient(to bottom,#16a34a,#065f46)",
    glow1: "rgba(34,197,94,0.40)", glow2: "rgba(22,163,74,0.40)", glow3: "rgba(5,150,105,0.40)",
    rentGrad: "linear-gradient(to right,#059669,#16a34a)",
    priceGrad: "linear-gradient(to right,#0d9488,#15803d)",
    ctaBlue: "linear-gradient(to right,#10b981,#16a34a)",
    ctaTeal: "linear-gradient(to right,#22c55e,#15803d)",
    ctaPurple: "linear-gradient(to right,#059669,#10b981)",
    accentA: "#16a34a",
  },
  // Midnight — light-navy background, white text, light-blue accents.
  midnight: {
    mode: "dark",
    bgBase: "#263a63",
    panelBg: "rgba(21,31,58,0.92)", headerBg: "rgba(38,58,99,0.55)", modalBg: "#1b2a4d", pageFade: "#263a63", dotBorder: "#263a63",
    orb1: "rgba(59,130,246,0.28)", orb2: "rgba(99,102,241,0.22)", orb3: "rgba(96,165,250,0.16)",
    logoFrom: "#93c5fd", logoTo: "#3b82f6", logoGlow: "rgba(59,130,246,0.40)",
    bar1: "linear-gradient(to bottom,#93c5fd,#6366f1)",
    bar2: "linear-gradient(to bottom,#67e8f9,#3b82f6)",
    bar3: "linear-gradient(to bottom,#818cf8,#6366f1)",
    glow1: "rgba(147,197,253,0.55)", glow2: "rgba(103,232,249,0.50)", glow3: "rgba(129,140,248,0.50)",
    rentGrad: "linear-gradient(to right,#bfdbfe,#a5b4fc)",
    priceGrad: "linear-gradient(to right,#a5f3fc,#bfdbfe)",
    ctaBlue: "linear-gradient(to right,#3b82f6,#6366f1)",
    ctaTeal: "linear-gradient(to right,#22d3ee,#3b82f6)",
    ctaPurple: "linear-gradient(to right,#818cf8,#6366f1)",
    accentA: "#93c5fd",
  },
};

// Per-theme overrides of Tailwind's base color variables. Because every
// `text-white`, `bg-white/[x]`, `text-blue-400`, etc. compiles to
// `var(--color-*)`, remapping these on the `data-theme` root recolours the
// entire UI without touching individual class names.
const GREEN: Record<number, string> = { 300: "#16a34a", 400: "#16a34a", 500: "#22c55e", 600: "#15803d", 700: "#166534" };
const BLUE: Record<number, string> = { 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" };
const accentVars = (families: string[], s: Record<number, string>) =>
  families.map((f) => [300, 400, 500, 600, 700].map((n) => `--color-${f}-${n}:${s[n]};`).join("")).join("");

export const THEME_VARS = `
[data-theme="aurora"]{--color-white:#0d1a12;${accentVars(["blue", "indigo", "purple", "fuchsia", "violet", "cyan", "sky", "teal"], GREEN)}}
[data-theme="midnight"]{${accentVars(["indigo", "purple", "fuchsia", "violet", "teal", "cyan", "sky", "emerald"], BLUE)}}
`;

export const ThemeContext = createContext<ThemeConfig>(THEMES.cosmos);
export const useTheme = () => useContext(ThemeContext);
