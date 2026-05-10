interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}

export default function PricingCard({
  title,
  price,
  features,
  isSelected,
  onSelect,
  recommended = false,
}: PricingCardProps) {
  return (
      <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
        isSelected
          ? 'border-primary-600 bg-primary-50'
          : 'border-surface-200 bg-surface-0 hover:border-primary-300'
      } ${recommended ? 'ring-2 ring-primary-600 ring-offset-2' : ''}`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-text-inverse">
          Recommended
        </div>
      )}

      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>

      <div className="mb-4">
        <span className="text-3xl font-bold text-text-primary">${price}</span>
        <span className="text-text-muted">/month</span>
      </div>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
