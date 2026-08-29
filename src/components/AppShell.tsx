import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="ambient-shell min-h-screen px-3 pb-12 text-foreground sm:px-5 lg:px-8 lg:pb-16">
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-three" aria-hidden="true" />
      <div className="ambient-content mx-auto flex w-full min-w-0 max-w-[1480px] flex-col gap-4 sm:gap-5">
        {children}
      </div>
    </main>
  );
}
