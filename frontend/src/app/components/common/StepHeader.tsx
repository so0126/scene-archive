import { cn } from "../ui/utils";

interface StepHeaderProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "업로드" },
  { id: 2, label: "에디팅" },
  { id: 3, label: "주문" },
] as const;

export function StepHeader({ currentStep }: StepHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive && "bg-[#8b9a8e] text-white",
                isDone && "bg-[#dfe7df] text-[#5b6b5f]",
                !isActive && !isDone && "bg-white text-[#888] border border-[#e5e5e5]"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {step.id}
              </span>
              <span>{step.label}</span>
            </div>

            {index !== steps.length - 1 && (
              <span className="text-[#aaa]">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}