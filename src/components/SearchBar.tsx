import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search statistics</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search 80+ global signals..."
        className="h-10 w-full rounded-xl border border-input bg-card/70 pl-9 pr-9 text-sm text-foreground shadow-subtle transition placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </label>
  );
}
