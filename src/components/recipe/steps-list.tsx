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
          <div className="flex-1">
            {(() => {
              const lines = step.description.split('\n').filter(line => line.trim());
              if (lines.length === 0) return null;

              if (lines.length === 1) {
                return <p>{lines[0]}</p>;
              }

              return (
                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1 flex-shrink-0">•</span>
                      <p className="flex-1">{line}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </li>
      ))}
    </ol>
  );
}