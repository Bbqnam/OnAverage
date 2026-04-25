import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="ambient-shell min-h-screen px-3 py-3 text-foreground sm:px-5 lg:px-6">
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-three" aria-hidden="true" />
      <div className="ambient-content mx-auto flex max-w-[1680px] flex-col gap-3">
        {children}
      </div>
    </main>
  );
}
