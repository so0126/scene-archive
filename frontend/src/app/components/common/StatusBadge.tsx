import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "../ui/utils";

type StatusType = "processing" | "ready" | "completed";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    processing: {
      text: "변환 중",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    ready: {
      text: "키워드 입력 필요",
      className: "bg-slate-50 text-slate-600 border-slate-200",
      icon: <Circle className="h-4 w-4" />,
    },
    completed: {
      text: "준비 완료",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        config.className
      )}
    >
      {config.icon}
      {config.text}
    </span>
  );
}