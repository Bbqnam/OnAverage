import { Activity, BarChart3 } from "lucide-react";
import { CountrySelector } from "./CountrySelector";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import type { CountryCode } from "../types/statistic";

interface HeaderProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({
  selectedCountry,
  onCountryChange,
  searchTerm,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 -mx-3 mb-1 border-b border-border/70 bg-background/80 px-3 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-[1480px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="logo-mark relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_22px_-10px_hsl(var(--primary)/0.9)]">
              <BarChart3 className="h-[18px] w-[18px]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-[-0.025em] text-foreground">
                OnAverage
              </h1>
              <div className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
                <Activity className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                Global signals, made tangible
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid w-full min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-2.5 lg:max-w-4xl lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center lg:justify-end">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 md:w-auto md:flex-nowrap md:justify-end">
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
            />
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
