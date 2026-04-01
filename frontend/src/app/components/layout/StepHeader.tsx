interface StepHeaderProps {
  currentStep: 1 | 2 | 3;
}

export function StepHeader({ currentStep }: StepHeaderProps) {
  const steps = ["1. 업로드", "2. 에디팅", "3. 주문"];

  return (
    <div className="mb-8 flex items-center gap-3 text-sm">
      {steps.map((step, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
        const active = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`rounded-full px-4 py-2 ${
                active
                  ? "bg-[#dfe7df] font-medium text-[#5b6b5f]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {step}
            </div>
            {index !== steps.length - 1 && <span className="text-slate-400">→</span>}
          </div>
        );
      })}
    </div>
  );
}