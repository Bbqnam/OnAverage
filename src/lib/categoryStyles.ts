import type { Category } from "../types/statistic";

interface CategoryStyle {
  line: string;
  text: string;
  iconBg: string;
  border: string;
  hover: string;
  glow: string;
}

export const categoryStyles: Record<Category, CategoryStyle> = {
  Life: {
    line: "bg-emerald-500",
    text: "text-emerald-500 dark:text-emerald-300",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    hover: "hover:border-emerald-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(16,185,129,0.65)]",
  },
  Travel: {
    line: "bg-blue-500",
    text: "text-blue-500 dark:text-blue-300",
    iconBg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hover: "hover:border-blue-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(59,130,246,0.65)]",
  },
  Work: {
    line: "bg-slate-500",
    text: "text-slate-600 dark:text-slate-300",
    iconBg: "bg-slate-500/10",
    border: "border-slate-500/25",
    hover: "hover:border-slate-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(100,116,139,0.65)]",
  },
  Technology: {
    line: "bg-violet-500",
    text: "text-violet-500 dark:text-violet-300",
    iconBg: "bg-violet-500/10",
    border: "border-violet-500/25",
    hover: "hover:border-violet-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(139,92,246,0.65)]",
  },
  Money: {
    line: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    iconBg: "bg-amber-500/10",
    border: "border-amber-500/25",
    hover: "hover:border-amber-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(245,158,11,0.65)]",
  },
  Environment: {
    line: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-300",
    iconBg: "bg-teal-500/10",
    border: "border-teal-500/25",
    hover: "hover:border-teal-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(20,184,166,0.65)]",
  },
  Society: {
    line: "bg-zinc-500",
    text: "text-zinc-600 dark:text-zinc-300",
    iconBg: "bg-zinc-500/10",
    border: "border-zinc-500/25",
    hover: "hover:border-zinc-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(113,113,122,0.6)]",
  },
  Fun: {
    line: "bg-pink-500",
    text: "text-pink-500 dark:text-pink-300",
    iconBg: "bg-pink-500/10",
    border: "border-pink-500/25",
    hover: "hover:border-pink-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(236,72,153,0.65)]",
  },
  Events: {
    line: "bg-rose-500",
    text: "text-rose-500 dark:text-rose-300",
    iconBg: "bg-rose-500/10",
    border: "border-rose-500/25",
    hover: "hover:border-rose-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(244,63,94,0.6)]",
  },
};

export function getCategoryStyle(category: Category): CategoryStyle {
  return categoryStyles[category];
}
