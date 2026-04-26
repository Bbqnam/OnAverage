import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="ambient-shell min-h-screen px-2.5 py-2 text-foreground sm:px-4 lg:px-5">
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-three" aria-hidden="true" />
      <div className="ambient-content mx-auto flex w-full min-w-0 max-w-[1680px] flex-col gap-2.5">
        {children}
      </div>
    </main>
  );
}
