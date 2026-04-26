import { Globe2 } from "lucide-react";
import { countryOptions } from "../data/statistics";
import type { CountryCode } from "../types/statistic";

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

export function CountrySelector({
  selectedCountry,
  onCountryChange,
}: CountrySelectorProps) {
  return (
    <label className="flex h-9 min-w-[9rem] shrink-0 items-center gap-2 rounded-lg border border-input bg-card px-2.5 text-sm text-card-foreground shadow-subtle">
      <Globe2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Country</span>
      <select
        value={selectedCountry}
        onChange={(event) => onCountryChange(event.target.value as CountryCode)}
        className="min-w-0 bg-transparent text-sm font-medium text-foreground outline-none"
      >
        {countryOptions.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
}
