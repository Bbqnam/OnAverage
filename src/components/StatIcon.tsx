import {
  Activity,
  Baby,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Camera,
  CandlestickChart,
  Car,
  CarFront,
  Circle,
  CircleDot,
  Cloud,
  Clock,
  Cog,
  Coffee,
  CreditCard,
  CupSoda,
  DollarSign,
  Download,
  Droplet,
  Gem,
  GraduationCap,
  Globe2,
  Heart,
  Home,
  House,
  Hospital,
  KeyRound,
  Landmark,
  Mail,
  MessageCircle,
  Moon,
  Newspaper,
  Orbit,
  Pizza,
  PlaneLanding,
  PlaneTakeoff,
  Recycle,
  Satellite,
  Search,
  Share2,
  ShieldAlert,
  Ship,
  ShoppingCart,
  Siren,
  Smile,
  Smartphone,
  Sparkles,
  Sprout,
  SquarePlay,
  Store,
  Sun,
  Tag,
  TrainFront,
  Trash2,
  TreePine,
  TrendingUp,
  TriangleAlert,
  UserCheck,
  UserMinus,
  Users,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface StatIconProps {
  name: string;
  className?: string;
}

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  baby: Baby,
  "circle-dot": CircleDot,
  clock: Clock,
  cog: Cog,
  "trending-up": TrendingUp,
  sun: Sun,
  moon: Moon,
  utensils: Utensils,
  coffee: Coffee,
  heart: Heart,
  tag: Tag,
  "plane-takeoff": PlaneTakeoff,
  "plane-landing": PlaneLanding,
  users: Users,
  car: Car,
  "triangle-alert": TriangleAlert,
  "train-front": TrainFront,
  ship: Ship,
  briefcase: Briefcase,
  "user-minus": UserMinus,
  store: Store,
  building: Building2,
  "user-check": UserCheck,
  search: Search,
  globe: Globe2,
  sparkles: Sparkles,
  mail: Mail,
  "message-circle": MessageCircle,
  newspaper: Newspaper,
  orbit: Orbit,
  "play-square": SquarePlay,
  download: Download,
  droplet: Droplet,
  share: Share2,
  bot: Bot,
  "credit-card": CreditCard,
  "shopping-cart": ShoppingCart,
  landmark: Landmark,
  gem: Gem,
  "dollar-sign": DollarSign,
  "candlestick-chart": CandlestickChart,
  "shield-alert": ShieldAlert,
  siren: Siren,
  hospital: Hospital,
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  home: Home,
  house: House,
  cloud: Cloud,
  "tree-pine": TreePine,
  sprout: Sprout,
  recycle: Recycle,
  satellite: Satellite,
  trash: Trash2,
  zap: Zap,
  pizza: Pizza,
  cup: CupSoda,
  smile: Smile,
  smartphone: Smartphone,
  camera: Camera,
  key: KeyRound,
  "car-front": CarFront,
};

export function StatIcon({ name, className = "h-4 w-4" }: StatIconProps) {
  if (name === "older-person") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="5" r="2.4" />
        <path d="M7.5 9.5h3.2l2.1 3.2" />
        <path d="M10.4 10.2 9 15.5" />
        <path d="M9 15.5 6.6 20" />
        <path d="M11.4 15.5 13.6 20" />
        <path d="M16 10v10" />
        <path d="M16 20h2" />
      </svg>
    );
  }

  const Icon = icons[name] ?? Circle;

  return <Icon className={className} aria-hidden="true" />;
}
