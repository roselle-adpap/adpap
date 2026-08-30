interface Props {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-navy-700/50">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
        <span>{steps[currentStep]}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentStep ? "bg-royal-600" : "bg-navy-900/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
