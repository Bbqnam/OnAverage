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
    <header className="sticky top-0 z-30 -mx-3 border-b border-border bg-background/85 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-normal text-foreground">
              OnAverage
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              A polished curiosity dashboard for average estimates.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 xl:max-w-5xl xl:flex-row xl:items-center xl:justify-end">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
          <div className="flex flex-wrap items-center gap-2">
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
