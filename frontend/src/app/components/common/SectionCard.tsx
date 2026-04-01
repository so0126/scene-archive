import type { ReactNode } from "react";
import { cn } from "../ui/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}