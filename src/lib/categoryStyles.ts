import type { Category } from "../types/statistic";

interface CategoryStyle {
  // existing
  line: string;
  text: string;
  iconBg: string;
  border: string;
  hover: string;
  glow: string;
  // new
  leftBorder: string;
  dot: string;
  pulse: string;
  rateBg: string;
  rateText: string;
}

export const categoryStyles: Record<Category, CategoryStyle> = {
  Life: {
    line: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    hover: "hover:border-emerald-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(16,185,129,0.65)]",
    leftBorder: "border-l-4 border-l-emerald-500",
    dot: "bg-emerald-500",
    pulse: "animate-pulse",
    rateBg: "bg-emerald-50 dark:bg-emerald-500/10",
    rateText: "text-emerald-700 dark:text-emerald-300",
  },
  Travel: {
    line: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hover: "hover:border-blue-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(59,130,246,0.65)]",
    leftBorder: "border-l-4 border-l-blue-500",
    dot: "bg-blue-500",
    pulse: "",
    rateBg: "bg-blue-50 dark:bg-blue-500/10",
    rateText: "text-blue-700 dark:text-blue-300",
  },
  Work: {
    line: "bg-slate-500",
    text: "text-slate-600 dark:text-slate-400",
    iconBg: "bg-slate-500/10",
    border: "border-slate-500/25",
    hover: "hover:border-slate-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(100,116,139,0.65)]",
    leftBorder: "border-l-4 border-l-slate-500",
    dot: "bg-slate-500",
    pulse: "",
    rateBg: "bg-slate-50 dark:bg-slate-500/10",
    rateText: "text-slate-700 dark:text-slate-300",
  },
  Technology: {
    line: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10",
    border: "border-violet-500/25",
    hover: "hover:border-violet-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(139,92,246,0.65)]",
    leftBorder: "border-l-4 border-l-violet-500",
    dot: "bg-violet-500",
    pulse: "",
    rateBg: "bg-violet-50 dark:bg-violet-500/10",
    rateText: "text-violet-700 dark:text-violet-300",
  },
  Money: {
    line: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    border: "border-amber-500/25",
    hover: "hover:border-amber-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(245,158,11,0.65)]",
    leftBorder: "border-l-4 border-l-amber-500",
    dot: "bg-amber-500",
    pulse: "",
    rateBg: "bg-amber-50 dark:bg-amber-500/10",
    rateText: "text-amber-700 dark:text-amber-300",
  },
  Environment: {
    line: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-500/10",
    border: "border-teal-500/25",
    hover: "hover:border-teal-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(20,184,166,0.65)]",
    leftBorder: "border-l-4 border-l-teal-500",
    dot: "bg-teal-500",
    pulse: "animate-pulse",
    rateBg: "bg-teal-50 dark:bg-teal-500/10",
    rateText: "text-teal-700 dark:text-teal-300",
  },
  Society: {
    line: "bg-zinc-500",
    text: "text-zinc-600 dark:text-zinc-400",
    iconBg: "bg-zinc-500/10",
    border: "border-zinc-500/25",
    hover: "hover:border-zinc-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(113,113,122,0.6)]",
    leftBorder: "border-l-4 border-l-zinc-500",
    dot: "bg-zinc-500",
    pulse: "",
    rateBg: "bg-zinc-50 dark:bg-zinc-500/10",
    rateText: "text-zinc-700 dark:text-zinc-300",
  },
  Fun: {
    line: "bg-pink-500",
    text: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-500/10",
    border: "border-pink-500/25",
    hover: "hover:border-pink-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(236,72,153,0.65)]",
    leftBorder: "border-l-4 border-l-pink-500",
    dot: "bg-pink-500",
    pulse: "",
    rateBg: "bg-pink-50 dark:bg-pink-500/10",
    rateText: "text-pink-700 dark:text-pink-300",
  },
  Events: {
    line: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10",
    border: "border-rose-500/25",
    hover: "hover:border-rose-500/35",
    glow: "hover:shadow-[0_18px_45px_-30px_rgba(244,63,94,0.6)]",
    leftBorder: "border-l-4 border-l-rose-500",
    dot: "bg-rose-500",
    pulse: "animate-pulse",
    rateBg: "bg-rose-50 dark:bg-rose-500/10",
    rateText: "text-rose-700 dark:text-rose-300",
  },
};

export function getCategoryStyle(category: Category): CategoryStyle {
  return categoryStyles[category];
}