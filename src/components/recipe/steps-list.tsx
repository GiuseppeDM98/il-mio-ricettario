import { Step } from '@/types';

interface StepsListProps {
  steps: Step[];
}

export function StepsList({ steps }: StepsListProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold mr-4">
            {index + 1}
          </div>
          <p className="flex-1">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}