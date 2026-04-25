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
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search any average..."
        className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground shadow-subtle transition placeholder:text-muted-foreground focus:border-ring focus:outline-none"
      />
    </label>
  );
}
