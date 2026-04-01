import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#2b2b2b]">
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </div>
  );
}