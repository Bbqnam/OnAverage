import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search statistics</span>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search any average..."
        className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground shadow-subtle transition placeholder:text-muted-foreground focus:border-ring focus:outline-none"
      />
    </label>
  );
}
