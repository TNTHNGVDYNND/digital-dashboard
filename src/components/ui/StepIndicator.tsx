interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between">
        {labels.map((label, index) => (
          <div
            key={index}
            className={`text-center text-sm ${
              index <= currentStep ? 'font-medium text-indigo-600' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="relative h-2 rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
