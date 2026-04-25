import {
  Activity,
  Bot,
  Briefcase,
  CircleDot,
  DollarSign,
  Heart,
  PlaneTakeoff,
  Smile,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { dashboardTabs } from "../data/categories";
import type { Category, DashboardTab, Statistic } from "../types/statistic";

interface CategoryTabsProps {
  selectedTab: DashboardTab;
  statistics: Statistic[];
  onTabChange: (tab: DashboardTab) => void;
}

const tabIcons: Record<DashboardTab, LucideIcon> = {
  All: CircleDot,
  Life: Heart,
  Travel: PlaneTakeoff,
  Work: Briefcase,
  Technology: Bot,
  Money: DollarSign,
  Environment: Sprout,
  Society: Users,
  Fun: Smile,
  Events: Activity,
};

export function CategoryTabs({ selectedTab, statistics, onTabChange }: CategoryTabsProps) {
  return (
    <nav className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card p-1 shadow-subtle">
      <div className="flex w-max gap-1">
        {dashboardTabs.map((tab) => {
          const count =
            tab === "All"
              ? statistics.length
              : statistics.filter((statistic) => statistic.category === (tab as Category)).length;
          const isSelected = selectedTab === tab;
          const Icon = tabIcons[tab];

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition sm:text-sm ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-pressed={isSelected}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {tab}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isSelected ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
