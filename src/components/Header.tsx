import { BarChart3 } from "lucide-react";
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
    <header className="sticky top-0 z-30 -mx-2.5 border-b border-border bg-background/88 px-2.5 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
      <div className="mx-auto flex w-full min-w-0 max-w-[1680px] flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-9 sm:w-9">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-normal text-foreground sm:text-xl">
              OnAverage
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              A polished curiosity dashboard for average estimates.
            </p>
          </div>
        </div>

        <div className="grid w-full min-w-0 flex-1 gap-2 md:grid-cols-[minmax(220px,1fr)_auto] lg:max-w-5xl lg:items-center lg:justify-end">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 md:w-auto md:flex-nowrap md:justify-end">
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
