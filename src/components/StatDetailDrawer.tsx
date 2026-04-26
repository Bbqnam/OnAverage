import {
  CalendarDays,
  CalendarRange,
  Clock,
  Clock3,
  ExternalLink,
  Globe2,
  LineChart,
  Sprout,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type Ref } from "react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { getCategoryStyle } from "../lib/categoryStyles";
import {
  yearlyToPerDay,
  yearlyToPerHour,
  yearlyToPerMinute,
  yearlyToPerSecond,
} from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface StatDetailDrawerProps {
  statistic: Statistic | null;
  onClose: () => void;
}

type VisualNodeShape = "circle" | "pill" | "square";
type VisualSceneKind =
  | "default"
  | "accident"
  | "bars"
  | "car"
  | "construction"
  | "environment"
  | "flight"
  | "mail"
  | "orbit"
  | "retirement"
  | "road"
  | "storm"
  | "water";

interface VisualNode {
  x: number;
  y: number;
  icon?: string;
  shape?: VisualNodeShape;
  opacity?: number;
}

interface VisualScene {
  kind?: VisualSceneKind;
  path: string;
  movingIcon: string;
  endIcon: string;
  startIcon?: string;
  nodes?: VisualNode[];
}

const DEFAULT_PATH = "M64 100 C 164 44 246 120 332 78 S 504 42 576 92";

const visualScenes: Record<string, VisualScene> = {
  "people-born": scene("baby", "users", "M72 104 C166 74 218 54 302 72 S462 118 568 76", "default", [
    node(112, 96, "baby", "circle"),
    node(298, 72, "heart", "circle"),
    node(466, 98, "users", "circle"),
  ]),
  "people-died": scene("circle-dot", "heart", "M70 78 C180 64 248 114 334 90 S474 58 568 98", "default", [
    node(116, 76, "heart", "circle"),
    node(318, 92, "circle-dot", "circle", 0.58),
    node(504, 90, "sprout", "circle", 0.68),
  ]),
  "population-change": scene("trending-up", "users", "M72 116 C164 108 232 92 314 80 S470 50 568 46", "bars", [
    node(112, 106, "users", "pill"),
    node(322, 78, "trending-up", "pill"),
    node(512, 52, "users", "pill"),
  ]),
  "people-waking-up": scene("sun", "coffee", "M76 116 C170 84 260 46 338 66 S478 106 568 74", "default", [
    node(116, 108, "moon", "circle"),
    node(318, 62, "sun", "circle"),
    node(500, 86, "coffee", "circle"),
  ]),
  "naps-started": scene("moon", "sun", "M70 72 C150 110 248 114 320 82 S462 48 568 78", "default", [
    node(114, 80, "moon", "circle"),
    node(320, 92, "coffee", "pill", 0.54),
    node(508, 72, "sun", "circle"),
  ]),
  "meals-eaten": scene("utensils", "utensils", "M72 92 C174 62 250 88 328 86 S478 54 566 94", "default", [
    node(116, 96, "utensils", "circle"),
    node(324, 84, "pizza", "circle"),
    node(504, 94, "cup", "circle"),
  ]),
  "coffee-consumed": scene("coffee", "coffee", "M68 102 C178 68 246 96 320 76 S468 72 572 104", "default", [
    node(116, 98, "coffee", "circle"),
    node(320, 78, "cup", "circle"),
    node(512, 98, "coffee", "circle"),
  ]),
  "people-getting-married": scene("heart", "heart", "M72 96 C170 46 252 112 320 78 S470 48 568 96", "default", [
    node(116, 92, "users", "circle"),
    node(320, 78, "heart", "circle"),
    node(512, 92, "users", "circle"),
  ]),
  "babies-named": scene("tag", "baby", "M76 90 C178 60 244 102 326 82 S472 54 564 92", "default", [
    node(116, 92, "baby", "circle"),
    node(318, 82, "tag", "pill"),
    node(508, 92, "tag", "circle"),
  ]),
  "flights-taking-off": scene("plane-takeoff", "plane-takeoff", "M58 118 C162 116 246 100 326 74 S470 34 586 46", "flight", [
    node(122, 116, "plane-takeoff", "pill"),
    node(330, 76, "cloud", "circle", 0.58),
    node(528, 48, "plane-takeoff", "circle"),
  ]),
  "flights-landing": scene("plane-landing", "plane-landing", "M56 42 C168 50 260 70 332 92 S480 118 586 118", "flight", [
    node(112, 44, "cloud", "circle", 0.58),
    node(330, 92, "plane-landing", "pill"),
    node(528, 116, "plane-landing", "circle"),
  ]),
  "passengers-flying": scene("users", "plane-takeoff", "M68 104 C174 62 248 72 326 82 S472 102 570 58", "flight", [
    node(116, 104, "users", "pill"),
    node(320, 80, "plane-takeoff", "circle"),
    node(514, 62, "users", "pill"),
  ]),
  "cars-produced": scene("car", "car", "M68 102 C178 100 244 82 326 84 S466 102 570 82", "car", [
    node(116, 102, "car", "pill"),
    node(320, 84, "cog", "square", 0.54),
    node(512, 84, "car", "circle"),
  ]),
  "road-accidents": scene("car-front", "triangle-alert", "M64 104 C172 104 232 88 310 92 S450 116 568 78", "accident", [
    node(120, 102, "car-front", "pill"),
    node(326, 92, "triangle-alert", "circle"),
    node(512, 80, "shield-alert", "circle", 0.68),
  ]),
  "train-journeys": scene("train-front", "train-front", "M66 96 C174 96 240 78 320 78 S470 96 574 96", "road", [
    node(116, 96, "train-front", "pill"),
    node(320, 78, "users", "circle", 0.58),
    node(514, 96, "train-front", "circle"),
  ]),
  "ships-arriving-ports": scene("ship", "ship", "M62 96 C172 68 248 112 326 92 S474 72 578 96", "water", [
    node(116, 96, "ship", "pill"),
    node(326, 92, "droplet", "circle", 0.54),
    node(514, 96, "home", "circle"),
  ]),
  "people-hired": scene("briefcase", "user-check", "M70 104 C172 62 250 82 324 80 S468 98 568 70", "default", [
    node(116, 104, "users", "circle"),
    node(320, 80, "briefcase", "pill"),
    node(510, 72, "user-check", "circle"),
  ]),
  "people-laid-off": scene("user-minus", "store", "M70 72 C164 94 244 70 320 86 S474 124 568 96", "default", [
    node(116, 76, "briefcase", "circle"),
    node(320, 86, "user-minus", "pill"),
    node(512, 96, "home", "circle"),
  ]),
  "new-businesses-started": scene("store", "store", "M72 110 C174 76 244 92 318 78 S462 50 568 76", "construction", [
    node(116, 108, "sprout", "circle"),
    node(318, 80, "store", "pill"),
    node(508, 76, "trending-up", "circle"),
  ]),
  "businesses-closing": scene("store", "store", "M72 66 C172 76 246 96 322 92 S468 116 568 100", "default", [
    node(116, 66, "store", "circle"),
    node(318, 92, "user-minus", "pill", 0.62),
    node(508, 100, "circle-dot", "circle", 0.54),
  ]),
  "companies-bankrupt": scene("building", "landmark", "M70 64 C172 74 248 104 326 96 S470 112 568 90", "bars", [
    node(116, 66, "building", "circle"),
    node(320, 96, "trending-up", "pill", 0.54),
    node(510, 90, "landmark", "circle"),
  ]),
  "people-retiring": scene("baby", "older-person", "M70 104 C170 58 246 66 318 82 S462 118 568 72", "retirement", [
    node(110, 104, "baby", "circle"),
    node(252, 70, "briefcase", "circle"),
    node(394, 102, "coffee", "circle"),
    node(526, 72, "older-person", "circle"),
  ]),
  "people-starting-new-job": scene("briefcase", "briefcase", "M70 108 C170 74 244 78 318 84 S466 106 568 64", "default", [
    node(116, 108, "users", "circle"),
    node(318, 84, "briefcase", "pill"),
    node(508, 66, "user-check", "circle"),
  ]),
  "internet-searches": scene("search", "search", "M68 96 C178 58 248 92 324 78 S468 52 570 96", "default", [
    node(116, 96, "search", "circle"),
    node(318, 80, "globe", "pill"),
    node(512, 96, "search", "circle"),
  ]),
  "emails-sent": scene("mail", "mail", "M66 104 C160 60 252 86 318 76 S462 48 570 88", "mail", [
    node(110, 104, "mail", "pill"),
    node(310, 78, "globe", "circle"),
    node(512, 88, "mail", "circle"),
  ]),
  "messages-sent": scene("message-circle", "message-circle", "M68 102 C172 72 248 110 322 82 S470 58 570 92", "default", [
    node(112, 102, "message-circle", "circle"),
    node(320, 82, "smartphone", "pill"),
    node(512, 92, "message-circle", "circle"),
  ]),
  "videos-watched": scene("play-square", "play-square", "M70 102 C174 70 246 72 324 86 S474 112 570 66", "default", [
    node(116, 102, "play-square", "circle"),
    node(318, 86, "smartphone", "pill"),
    node(512, 68, "play-square", "circle"),
  ]),
  "apps-downloaded": scene("download", "smartphone", "M74 52 C178 58 244 76 320 90 S468 118 566 96", "default", [
    node(116, 54, "download", "circle"),
    node(320, 90, "smartphone", "pill"),
    node(508, 96, "download", "circle"),
  ]),
  "social-posts-created": scene("share", "message-circle", "M68 98 C170 58 248 76 324 76 S474 92 570 56", "default", [
    node(116, 98, "camera", "circle"),
    node(320, 76, "share", "pill"),
    node(512, 58, "message-circle", "circle"),
  ]),
  "ai-prompts-asked": scene("bot", "bot", "M68 92 C174 64 246 104 322 82 S468 54 570 96", "default", [
    node(116, 92, "bot", "circle"),
    node(320, 82, "message-circle", "pill"),
    node(512, 96, "sparkles", "circle"),
  ]),
  "card-payments-made": scene("credit-card", "store", "M70 96 C174 70 248 94 322 86 S466 60 568 94", "default", [
    node(116, 96, "credit-card", "pill"),
    node(320, 86, "dollar-sign", "circle"),
    node(510, 94, "store", "circle"),
  ]),
  "online-purchases": scene("shopping-cart", "store", "M72 100 C178 74 246 92 322 80 S466 54 568 86", "default", [
    node(116, 100, "shopping-cart", "circle"),
    node(320, 80, "credit-card", "pill"),
    node(510, 86, "store", "circle"),
  ]),
  "personal-bankruptcies": scene("landmark", "shield-alert", "M70 68 C174 80 244 106 322 96 S468 112 568 88", "bars", [
    node(116, 68, "landmark", "circle"),
    node(320, 96, "triangle-alert", "pill"),
    node(510, 88, "shield-alert", "circle"),
  ]),
  "new-millionaires": scene("gem", "trending-up", "M72 108 C178 70 248 90 322 74 S468 42 568 62", "bars", [
    node(116, 108, "dollar-sign", "circle"),
    node(320, 74, "gem", "pill"),
    node(510, 62, "trending-up", "circle"),
  ]),
  "money-spent-online": scene("dollar-sign", "shopping-cart", "M70 96 C174 54 250 96 322 78 S466 62 568 96", "default", [
    node(116, 96, "dollar-sign", "circle"),
    node(320, 78, "credit-card", "pill"),
    node(510, 96, "shopping-cart", "circle"),
  ]),
  "stock-trades": scene("candlestick-chart", "trending-up", "M70 112 C176 64 248 100 322 70 S468 118 568 58", "bars", [
    node(116, 112, "candlestick-chart", "circle"),
    node(320, 72, "trending-up", "pill"),
    node(510, 58, "dollar-sign", "circle"),
  ]),
  "crypto-trades": scene("candlestick-chart", "gem", "M70 100 C174 52 250 110 324 74 S468 54 568 98", "bars", [
    node(116, 100, "gem", "circle"),
    node(320, 76, "candlestick-chart", "pill"),
    node(510, 98, "dollar-sign", "circle"),
  ]),
  "crimes-reported": scene("shield-alert", "shield-alert", "M70 86 C174 62 248 106 322 92 S468 62 568 96", "accident", [
    node(116, 86, "shield-alert", "circle"),
    node(320, 92, "siren", "pill"),
    node(510, 96, "landmark", "circle"),
  ]),
  "emergency-calls": scene("siren", "hospital", "M70 108 C174 62 248 82 322 78 S468 100 568 66", "accident", [
    node(116, 108, "siren", "circle"),
    node(320, 78, "message-circle", "pill"),
    node(510, 68, "hospital", "circle"),
  ]),
  "hospital-visits": scene("hospital", "hospital", "M70 104 C176 76 248 82 322 84 S468 96 568 72", "default", [
    node(116, 104, "users", "circle"),
    node(320, 84, "heart", "pill"),
    node(510, 72, "hospital", "circle"),
  ]),
  "students-starting-school": scene("graduation-cap", "book-open", "M70 112 C174 76 250 86 322 78 S468 50 568 74", "default", [
    node(116, 112, "users", "circle"),
    node(320, 78, "graduation-cap", "pill"),
    node(510, 74, "book-open", "circle"),
  ]),
  "books-sold": scene("book-open", "shopping-cart", "M72 98 C174 66 246 98 322 82 S468 60 568 96", "default", [
    node(116, 98, "book-open", "circle"),
    node(320, 82, "store", "pill"),
    node(510, 96, "shopping-cart", "circle"),
  ]),
  "people-moving-homes": scene("home", "home", "M70 104 C174 64 248 88 322 82 S468 110 568 68", "default", [
    node(116, 104, "home", "circle"),
    node(320, 82, "ship", "pill", 0.5),
    node(510, 68, "home", "circle"),
  ]),
  "co2-emitted": scene("cloud", "cloud", "M70 106 C176 72 246 92 322 76 S468 52 568 88", "environment", [
    node(116, 106, "cloud", "circle"),
    node(320, 76, "tree-pine", "pill", 0.5),
    node(510, 88, "cloud", "circle"),
  ]),
  "trees-cut-down": scene("tree-pine", "trash", "M70 62 C174 76 248 104 322 98 S468 96 568 82", "environment", [
    node(116, 62, "tree-pine", "circle"),
    node(320, 98, "triangle-alert", "pill", 0.58),
    node(510, 82, "trash", "circle"),
  ]),
  "trees-planted": scene("sprout", "tree-pine", "M70 112 C174 88 248 78 322 70 S468 50 568 62", "environment", [
    node(116, 112, "sprout", "circle"),
    node(320, 70, "droplet", "pill", 0.55),
    node(510, 62, "tree-pine", "circle"),
  ]),
  "plastic-bottles-used": scene("recycle", "trash", "M70 92 C174 68 248 104 322 86 S468 56 568 96", "environment", [
    node(116, 92, "droplet", "circle"),
    node(320, 86, "recycle", "pill"),
    node(510, 96, "trash", "circle"),
  ]),
  "waste-produced": scene("trash", "recycle", "M70 94 C174 62 248 88 322 90 S468 116 568 76", "environment", [
    node(116, 94, "trash", "circle"),
    node(320, 90, "store", "pill", 0.48),
    node(510, 76, "recycle", "circle"),
  ]),
  "renewable-energy-generated": scene("zap", "sprout", "M70 108 C174 62 248 78 322 70 S468 96 568 58", "environment", [
    node(116, 108, "sun", "circle"),
    node(320, 70, "zap", "pill"),
    node(510, 58, "sprout", "circle"),
  ]),
  "freshwater-withdrawn": scene("droplet", "droplet", "M70 78 C174 112 248 94 322 86 S468 56 568 90", "water", [
    node(116, 78, "droplet", "circle"),
    node(320, 86, "home", "pill", 0.5),
    node(510, 90, "sprout", "circle"),
  ]),
  "pizzas-eaten": scene("pizza", "utensils", "M70 98 C174 66 248 100 322 82 S468 60 568 96", "default", [
    node(116, 98, "pizza", "circle"),
    node(320, 82, "utensils", "pill"),
    node(510, 96, "smile", "circle"),
  ]),
  "tea-consumed": scene("cup", "cup", "M70 100 C174 66 248 86 322 78 S468 104 568 72", "default", [
    node(116, 100, "cup", "circle"),
    node(320, 78, "droplet", "pill", 0.5),
    node(510, 72, "cup", "circle"),
  ]),
  "people-laughing": scene("smile", "smile", "M70 102 C174 54 248 112 322 80 S468 52 568 98", "default", [
    node(116, 102, "message-circle", "circle"),
    node(320, 80, "smile", "pill"),
    node(510, 98, "users", "circle"),
  ]),
  "people-scrolling-phones": scene("smartphone", "smartphone", "M70 108 C174 72 248 92 322 78 S468 54 568 88", "default", [
    node(116, 108, "smartphone", "circle"),
    node(320, 78, "share", "pill"),
    node(510, 88, "message-circle", "circle"),
  ]),
  "selfies-taken": scene("camera", "smartphone", "M70 100 C174 62 248 86 322 80 S468 100 568 66", "default", [
    node(116, 100, "camera", "circle"),
    node(320, 80, "smile", "pill"),
    node(510, 66, "smartphone", "circle"),
  ]),
  "people-losing-keys": scene("key", "home", "M70 70 C174 110 248 54 322 92 S468 116 568 78", "default", [
    node(116, 70, "key", "circle"),
    node(320, 92, "search", "pill"),
    node(510, 78, "home", "circle"),
  ]),
  "people-stuck-in-traffic": scene("car-front", "car-front", "M70 104 C174 104 248 86 322 92 S468 112 568 88", "road", [
    node(116, 104, "car-front", "pill"),
    node(320, 92, "clock", "circle", 0.5),
    node(510, 88, "car", "pill"),
  ]),
  "asteroids-passing-earth": scene("orbit", "globe", "M78 112 C170 42 274 34 354 76 S492 142 566 58", "orbit", [
    node(126, 104, "orbit", "circle"),
    node(320, 80, "globe", "circle"),
    node(514, 60, "orbit", "circle"),
  ]),
  "lightning-strikes": scene("zap", "cloud", "M70 64 C174 110 248 52 322 92 S468 54 568 104", "storm", [
    node(116, 64, "cloud", "circle"),
    node(320, 92, "zap", "pill"),
    node(510, 104, "cloud", "circle"),
  ]),
  "satellites-orbiting-earth": scene("satellite", "globe", "M74 106 C172 36 286 34 350 78 S494 126 566 54", "orbit", [
    node(126, 102, "satellite", "circle"),
    node(320, 80, "globe", "circle"),
    node(514, 56, "satellite", "circle"),
  ]),
  "houses-built": scene("house", "house", "M70 112 C174 88 248 78 322 72 S468 56 568 74", "construction", [
    node(116, 112, "sprout", "circle"),
    node(320, 72, "house", "pill"),
    node(510, 74, "home", "circle"),
  ]),
  "cars-passing-inspection": scene("car-front", "user-check", "M70 102 C174 92 248 78 322 84 S468 100 568 72", "car", [
    node(116, 102, "car-front", "pill"),
    node(320, 84, "shield-alert", "circle", 0.58),
    node(510, 72, "user-check", "circle"),
  ]),
  "earthquakes-detected": scene("activity", "activity", "M70 96 L170 96 L208 58 L258 118 L306 82 L372 82 L418 62 L470 102 L568 92", "accident", [
    node(116, 96, "activity", "circle"),
    node(320, 82, "triangle-alert", "pill", 0.58),
    node(510, 92, "activity", "circle"),
  ]),
  "storms-active": scene("cloud", "zap", "M70 82 C174 52 248 90 322 84 S468 54 568 94", "storm", [
    node(116, 82, "cloud", "circle"),
    node(320, 84, "zap", "pill"),
    node(510, 94, "droplet", "circle"),
  ]),
  "news-articles-published": scene("newspaper", "newspaper", "M70 100 C174 66 248 86 322 78 S468 100 568 68", "mail", [
    node(116, 100, "newspaper", "circle"),
    node(320, 78, "share", "pill"),
    node(510, 68, "smartphone", "circle"),
  ]),
};

function scene(
  movingIcon: string,
  endIcon: string,
  path = DEFAULT_PATH,
  kind: VisualSceneKind = "default",
  nodes: VisualNode[] = [],
): VisualScene {
  return { kind, path, movingIcon, endIcon, nodes };
}

function node(
  x: number,
  y: number,
  icon?: string,
  shape: VisualNodeShape = "circle",
  opacity = 1,
): VisualNode {
  return { x, y, icon, shape, opacity };
}

function confidenceLabel(statistic: Statistic): string {
  if (statistic.confidence === "high") return "Based on a strong institutional data series";
  if (statistic.confidence === "medium")
    return "Grounded in public reporting, may be rounded";
  return statistic.isFuzzyEstimate
    ? "Directional or playful estimate — useful for curiosity"
    : "Source coverage is incomplete or not globally standardized";
}

function StatHeroVisual({ statistic }: { statistic: Statistic }) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const fillPathRef = useRef<SVGPathElement>(null);
  const motionPathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const [travelerPhase, setTravelerPhase] = useState(0);
  const scene = visualScenes[statistic.id] ?? {
    kind: "default",
    path: DEFAULT_PATH,
    movingIcon: statistic.icon,
    endIcon: statistic.icon,
    nodes: [node(116, 96, statistic.icon), node(320, 78, statistic.icon, "pill", 0.56)],
  };
  const travelerIcons = getThreePhaseIcons(getTravelerIcons(scene, statistic.icon));

  useEffect(() => {
    const pathElement = motionPathRef.current;
    const fillPathElement = fillPathRef.current;
    const travelerElement = travelerRef.current;

    if (!pathElement || !fillPathElement || !travelerElement) {
      return;
    }

    const path = pathElement;
    const fillPath = fillPathElement;
    const traveler = travelerElement;
    const pathLength = path.getTotalLength();
    const durationMs = 6400;
    let animationFrameId = 0;
    let startedAt: number | null = null;

    function setProgress(progress: number) {
      const point = path.getPointAtLength(pathLength * progress);
      traveler.style.left = `${(point.x / 640) * 100}%`;
      traveler.style.top = `${(point.y / 160) * 100}%`;
      fillPath.style.strokeDashoffset = `${100 - progress * 100}`;

      const nextPhase = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;

      if (phaseRef.current !== nextPhase) {
        phaseRef.current = nextPhase;
        setTravelerPhase(nextPhase);
      }
    }

    function animate(now: number) {
      startedAt ??= now;

      const cycleProgress = ((now - startedAt) % (durationMs * 2)) / durationMs;
      const progress =
        cycleProgress <= 1 ? cycleProgress : 2 - cycleProgress;

      setProgress(progress);
      animationFrameId = window.requestAnimationFrame(animate);
    }

    phaseRef.current = 0;
    setTravelerPhase(0);
    setProgress(0);
    animationFrameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [scene.path]);

  return (
    <div
      className={`relative mt-4 h-32 overflow-hidden rounded-xl border ${categoryStyle.border} bg-background/65 sm:h-36`}
      aria-hidden="true"
    >
      <div className={`absolute inset-0 ${categoryStyle.iconBg}`} />
      <div className={`absolute inset-0 ${categoryStyle.text}`}>
        <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
          <SceneBackdrop kind={scene.kind ?? "default"} />
          <path
            ref={motionPathRef}
            d={scene.path}
            fill="none"
            stroke="currentColor"
            strokeDasharray="9 15"
            strokeLinecap="round"
            strokeOpacity="0.24"
            strokeWidth="3"
          />
          <path
            ref={fillPathRef}
            className="stat-visual-fill-line"
            d={scene.path}
            fill="none"
            pathLength={100}
            stroke="currentColor"
            strokeLinecap="round"
            strokeOpacity="0.45"
            strokeWidth="3"
          />
          {(scene.nodes ?? []).map((visualNode, index) => (
            <VisualIconNode
              key={`${visualNode.icon ?? "node"}-${visualNode.x}-${visualNode.y}-${index}`}
              node={visualNode}
            />
          ))}
        </svg>
        <VisualTraveler
          icons={travelerIcons}
          phase={travelerPhase}
          travelerRef={travelerRef}
        />
      </div>
    </div>
  );
}

function getTravelerIcons(scene: VisualScene, fallbackIcon: string): string[] {
  const icons = [
    scene.startIcon ?? scene.movingIcon,
    ...(scene.nodes ?? []).map((visualNode) => visualNode.icon),
    scene.endIcon,
  ].filter((icon): icon is string => Boolean(icon));

  const stagedIcons = icons.filter(
    (icon, index, allIcons) => index === 0 || icon !== allIcons[index - 1],
  );

  if (stagedIcons.length > 1) {
    return stagedIcons;
  }

  return [stagedIcons[0] ?? fallbackIcon, fallbackIcon === "sparkles" ? "circle-dot" : "sparkles"];
}

function SceneBackdrop({ kind }: { kind: VisualSceneKind }) {
  if (kind === "flight") {
    return (
      <>
        <path d="M42 122 H598" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
        <path d="M98 48 H188 M442 54 H540" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" strokeLinecap="round" />
      </>
    );
  }

  if (kind === "road" || kind === "car" || kind === "accident") {
    return (
      <>
        <path d="M42 110 H598" stroke="currentColor" strokeOpacity="0.16" strokeWidth="18" strokeLinecap="round" />
        <path d="M70 110 H570" stroke="currentColor" strokeDasharray="18 20" strokeOpacity="0.32" strokeWidth="3" strokeLinecap="round" />
        {kind === "accident" && (
          <path d="M444 76 L474 126 H414 Z" fill="currentColor" opacity="0.08" />
        )}
      </>
    );
  }

  if (kind === "retirement") {
    return (
      <>
        <path d="M76 118 H564" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
        <path d="M76 80 H564" stroke="currentColor" strokeOpacity="0.08" strokeWidth="2" />
      </>
    );
  }

  if (kind === "mail") {
    return (
      <>
        <path d="M70 116 H520" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
        <rect x="508" y="76" width="48" height="40" rx="12" fill="currentColor" opacity="0.1" />
        <path d="M516 86 H548 V108 H516 Z M516 86 L532 98 L548 86" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }

  if (kind === "orbit") {
    return (
      <>
        <ellipse cx="320" cy="80" rx="112" ry="42" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="2" />
        <ellipse cx="320" cy="80" rx="154" ry="62" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" transform="rotate(-18 320 80)" />
        <circle cx="320" cy="80" r="26" fill="currentColor" opacity="0.1" />
      </>
    );
  }

  if (kind === "bars") {
    return (
      <>
        {[106, 190, 274, 358, 442, 526].map((x, index) => (
          <rect
            key={x}
            className={`stat-visual-bar stat-visual-bar-${(index % 4) + 1}`}
            x={x}
            y={90 - index * 4}
            width="34"
            height={42 + index * 6}
            rx="10"
            fill="currentColor"
            opacity="0.14"
          />
        ))}
      </>
    );
  }

  if (kind === "environment" || kind === "construction" || kind === "storm" || kind === "water") {
    return (
      <>
        <path d="M58 120 C156 106 242 122 330 112 S496 100 586 118" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" strokeLinecap="round" />
        {kind === "storm" && (
          <path d="M106 62 C128 42 164 46 176 68 C204 60 230 76 230 102 H92 C78 88 84 68 106 62 Z" fill="currentColor" opacity="0.11" />
        )}
        {kind === "construction" && (
          <path d="M468 112 V82 L506 58 L544 82 V112 M486 112 V92 H526 V112" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </>
    );
  }

  return (
    <>
      <path d="M56 52 H584 M56 84 H584 M56 116 H584" stroke="currentColor" strokeLinecap="round" strokeOpacity="0.08" strokeWidth="2" />
      <circle cx="104" cy="76" r="22" fill="currentColor" opacity="0.06" />
      <circle cx="520" cy="86" r="32" fill="currentColor" opacity="0.07" />
    </>
  );
}

function VisualIconNode({ node }: { node: VisualNode }) {
  const width = node.shape === "pill" ? 58 : node.shape === "square" ? 44 : 42;
  const height = node.shape === "pill" ? 34 : node.shape === "square" ? 42 : 42;
  const radius = node.shape === "pill" ? "rounded-2xl" : node.shape === "square" ? "rounded-lg" : "rounded-full";

  return (
    <foreignObject
      x={node.x - width / 2}
      y={node.y - height / 2}
      width={width}
      height={height}
      opacity={node.opacity ?? 1}
    >
      <div
        className={`h-full w-full ${radius} bg-current/10`}
      />
    </foreignObject>
  );
}

function VisualTraveler({
  icons,
  phase,
  travelerRef,
}: {
  icons: string[];
  phase: number;
  travelerRef: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={travelerRef}
      className="stat-visual-traveler pointer-events-none absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-current shadow-sm"
    >
      {icons.map((icon, index) => (
        <span
          key={`${icon}-${index}`}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-linear ${
            phase === index ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <StatIcon name={icon} className="h-4 w-4 text-current" />
        </span>
      ))}
    </div>
  );
}

function getThreePhaseIcons(icons: string[]): string[] {
  const fallback = icons[0] ?? "circle-dot";

  return [
    icons[0] ?? fallback,
    icons[Math.max(1, Math.floor((icons.length - 1) / 2))] ?? fallback,
    icons[icons.length - 1] ?? fallback,
  ];
}

export function StatDetailDrawer({ statistic, onClose }: StatDetailDrawerProps) {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  useEffect(() => {
    if (!statistic) return;
    setMethodologyOpen(false);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, statistic]);

  if (!statistic) return null;

  const categoryStyle = getCategoryStyle(statistic.category);

  const conversions = [
    {
      label: "Per second",
      sublabel: "every second",
      value: yearlyToPerSecond(statistic.yearlyEstimate),
      icon: Clock3,
      style: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Per minute",
      sublabel: "every minute",
      value: yearlyToPerMinute(statistic.yearlyEstimate),
      icon: Timer,
      style: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Per hour",
      sublabel: "every hour",
      value: yearlyToPerHour(statistic.yearlyEstimate),
      icon: Clock,
      style: "text-violet-400 bg-violet-500/10",
    },
    {
      label: "Per day",
      sublabel: "every day",
      value: yearlyToPerDay(statistic.yearlyEstimate),
      icon: CalendarDays,
      style: "text-orange-400 bg-orange-500/10",
    },
    {
      label: "Per year",
      sublabel: "the seed value",
      value: statistic.yearlyEstimate,
      icon: CalendarRange,
      style: `${categoryStyle.iconBg} ${categoryStyle.text}`,
    },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-start justify-center overflow-y-auto bg-background/75 p-2 backdrop-blur-md sm:p-4 lg:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stat-drawer-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="my-auto max-h-[calc(100vh-1rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 text-card-foreground shadow-panel sm:max-h-[calc(100vh-2rem)] sm:p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${categoryStyle.iconBg} ${categoryStyle.text}`}
            >
              <StatIcon name={statistic.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-widest ${categoryStyle.text}`}>
                {statistic.category}
              </p>
              <h2
                id="stat-drawer-title"
                className="mt-0.5 text-xl font-semibold leading-snug sm:text-2xl"
              >
                {statistic.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <DataModeBadge dataMode={statistic.dataMode} />
                {statistic.sensitivity === "Sensitive" && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Contextual topic
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Hero visual — kept exactly as original */}
        <StatHeroVisual statistic={statistic} />

        {/* Description */}
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {statistic.description}
        </p>

        {/* Context note */}
        {statistic.contextNote && (
          <p className="mt-2 text-xs italic leading-5 text-muted-foreground/70">
            {statistic.contextNote}
          </p>
        )}

        {/* Converted averages */}
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Converted averages
          </h3>
          <div className="overflow-hidden rounded-xl border border-border bg-background/70">
            {conversions.map((conversion) => {
              const Icon = conversion.icon;
              return (
                <div
                  key={conversion.label}
                  className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${conversion.style}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">{conversion.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatLargeNumber(conversion.value, conversion.value >= 10_000)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {statistic.unit}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info row: source + confidence + yearly seed */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Source */}
          <div
            className={`rounded-xl border ${categoryStyle.border} ${categoryStyle.iconBg} p-3`}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <Globe2 className={`h-3.5 w-3.5 ${categoryStyle.text}`} aria-hidden="true" />
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider ${categoryStyle.text}`}
              >
                Source
              </p>
            </div>
            {statistic.sourceUrl ? (
              <a
                href={statistic.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                <span className="line-clamp-2">{statistic.sourceName}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <p className="line-clamp-2 text-xs font-medium">{statistic.sourceName}</p>
            )}
            {statistic.sourceYear && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Based on {statistic.sourceYear} data
              </p>
            )}
          </div>

          {/* Confidence */}
          <div className="rounded-xl border border-border bg-background/70 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Confidence
              </p>
              <ConfidenceBadge confidence={statistic.confidence} />
            </div>
            <p className="text-xs leading-4 text-muted-foreground">
              {confidenceLabel(statistic)}
            </p>
          </div>

          {/* Yearly seed + confidence interval */}
          <div className="rounded-xl border border-border bg-background/70 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Yearly estimate
              </p>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {formatLargeNumber(statistic.yearlyEstimate, true)}
            </p>
            <p className="text-xs text-muted-foreground">{statistic.unit}</p>
            {statistic.confidenceInterval && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Range:{" "}
                <span className="font-medium tabular-nums">
                  {formatLargeNumber(statistic.confidenceInterval.low, true)}–
                  {formatLargeNumber(statistic.confidenceInterval.high, true)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Historical change */}
        {statistic.historicalChange && (
          <div className="mt-3 rounded-xl border border-border bg-background/70 p-3">
            <div className="flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Historical context
              </p>
            </div>
            <p className="mt-1.5 text-sm text-foreground">
              This rate is{" "}
              <span
                className={
                  statistic.historicalChange.percentChange >= 0
                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                    : "font-semibold text-rose-600 dark:text-rose-400"
                }
              >
                {statistic.historicalChange.percentChange >= 0 ? "+" : ""}
                {statistic.historicalChange.percentChange}%
              </span>{" "}
              compared to {statistic.historicalChange.label}.
            </p>
          </div>
        )}

        {/* Surprise fact */}
        {statistic.surpriseFact && (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Did you know?
              </p>
            </div>
            <p className="mt-1.5 text-sm leading-5 text-foreground">
              {statistic.surpriseFact}
            </p>
          </div>
        )}

        {/* Methodology — collapsed by default */}
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setMethodologyOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent/50"
          >
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">How is this calculated?</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {methodologyOpen ? "Hide" : "Show"}
            </span>
          </button>
          {methodologyOpen && (
            <div className="border-t border-border px-4 py-3">
              <p className="text-sm leading-6 text-muted-foreground">{statistic.methodology}</p>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
