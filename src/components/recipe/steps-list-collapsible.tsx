'use client';

import { useState } from 'react';
import { Step } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StepsListCollapsibleProps {
  steps: Step[];
  defaultExpanded?: boolean;
  interactive?: boolean;
  checkedSteps?: string[];
  onToggleStep?: (stepId: string) => void;
}

interface GroupedSteps {
  section: string | null;
  steps: Step[];
}

export function StepsListCollapsible({
  steps,
  defaultExpanded = false,
  interactive = false,
  checkedSteps = [],
  onToggleStep,
}: StepsListCollapsibleProps) {
  // Group steps by section
  const groupedSteps: GroupedSteps[] = [];
  const stepsBySection = new Map<string | null, Step[]>();

  steps.forEach(step => {
    const section = step.section || null;
    if (!stepsBySection.has(section)) {
      stepsBySection.set(section, []);
    }
    stepsBySection.get(section)!.push(step);
  });

  // Convert to array and sort: null section first, then by order
  stepsBySection.forEach((steps, section) => {
    groupedSteps.push({ section, steps });
  });

  // Sort: null section first, then alphabetically
  groupedSteps.sort((a, b) => {
    if (a.section === null) return -1;
    if (b.section === null) return 1;
    return a.section.localeCompare(b.section);
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpanded ? groupedSteps.map(g => g.section || 'no-section') : [])
  );

  const toggleSection = (section: string | null) => {
    const key = section || 'no-section';
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  // Calculate global step numbers
  let globalStepNumber = 0;

  return (
    <div className="space-y-4">
      {groupedSteps.map((group, groupIndex) => {
        const sectionKey = group.section || 'no-section';
        const isExpanded = expandedSections.has(sectionKey);
        const hasSection = group.section !== null;

        // If no section, render steps directly without collapsible header
        if (!hasSection) {
          return (
            <div key={sectionKey} className="space-y-4">
              {group.steps.map((step) => {
                globalStepNumber++;
                const isChecked = checkedSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    className={`flex items-start ${interactive ? 'cursor-pointer hover:bg-gray-50 p-3 rounded transition-colors' : ''}`}
                    onClick={() => interactive && onToggleStep?.(step.id)}
                  >
                    {interactive && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleStep?.(step.id)}
                        className="flex-shrink-0 mr-3 mt-1 w-5 h-5 cursor-pointer"
                      />
                    )}
                    <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${isChecked && interactive ? 'bg-gray-400' : 'bg-primary'} text-primary-foreground font-bold mr-4`}>
                      {globalStepNumber}
                    </div>
                    <div className={`flex-1 ${isChecked && interactive ? 'opacity-50' : ''}`}>
                      {(() => {
                        const lines = step.description.split('\n').filter(line => line.trim());
                        if (lines.length === 0) return null;

                        if (lines.length === 1) {
                          return <p className={`text-gray-800 ${isChecked && interactive ? 'line-through' : ''}`}>{lines[0]}</p>;
                        }

                        return (
                          <div className="space-y-2">
                            {lines.map((line, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-gray-500 mt-1 flex-shrink-0">•</span>
                                <p className={`text-gray-800 flex-1 ${isChecked && interactive ? 'line-through' : ''}`}>{line}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      {step.duration && (
                        <p className={`text-sm text-gray-500 mt-1 ${isChecked && interactive ? 'line-through' : ''}`}>
                          Tempo: {step.duration} min
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Render collapsible section
        return (
          <div key={sectionKey} className="border rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(group.section)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
                <h3 className="font-semibold text-lg text-gray-900">
                  {group.section}
                </h3>
              </div>
            </button>

            {/* Section Steps */}
            {isExpanded && (
              <div className="p-4 space-y-4 border-t">
                {group.steps.map((step) => {
                  globalStepNumber++;
                  const isChecked = checkedSteps.includes(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start ${interactive ? 'cursor-pointer hover:bg-gray-50 p-3 rounded transition-colors' : ''}`}
                      onClick={() => interactive && onToggleStep?.(step.id)}
                    >
                      {interactive && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleStep?.(step.id)}
                          className="flex-shrink-0 mr-3 mt-1 w-5 h-5 cursor-pointer"
                        />
                      )}
                      <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${isChecked && interactive ? 'bg-gray-400' : 'bg-primary'} text-primary-foreground font-bold mr-4`}>
                        {globalStepNumber}
                      </div>
                      <div className={`flex-1 ${isChecked && interactive ? 'opacity-50' : ''}`}>
                        {(() => {
                          const lines = step.description.split('\n').filter(line => line.trim());
                          if (lines.length === 0) return null;

                          if (lines.length === 1) {
                            return <p className={`text-gray-800 ${isChecked && interactive ? 'line-through' : ''}`}>{lines[0]}</p>;
                          }

                          return (
                            <div className="space-y-2">
                              {lines.map((line, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-gray-500 mt-1 flex-shrink-0">•</span>
                                  <p className={`text-gray-800 flex-1 ${isChecked && interactive ? 'line-through' : ''}`}>{line}</p>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                        {step.duration && (
                          <p className={`text-sm text-gray-500 mt-1 ${isChecked && interactive ? 'line-through' : ''}`}>
                            Tempo: {step.duration} min
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reserve space for collapsed step numbers */}
            {!isExpanded && (() => {
              group.steps.forEach(() => globalStepNumber++);
              return null;
            })()}
          </div>
        );
      })}
    </div>
  );
}
