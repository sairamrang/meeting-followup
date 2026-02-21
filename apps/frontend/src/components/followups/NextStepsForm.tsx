import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { NextStepItem } from '@meeting-followup/shared';

interface NextStepsFormProps {
  steps: NextStepItem[];
  onChange: (steps: NextStepItem[]) => void;
  editable?: boolean;
}

export function NextStepsForm({ steps, onChange, editable = true }: NextStepsFormProps) {
  const [localSteps, setLocalSteps] = useState<NextStepItem[]>(steps);

  const handleAddStep = () => {
    const newStep: NextStepItem = {
      action: '',
      owner: '',
      deadline: '',
      completed: false,
    };
    const updated = [...localSteps, newStep];
    setLocalSteps(updated);
    onChange(updated);
  };

  const handleRemoveStep = (index: number) => {
    const updated = localSteps.filter((_, i) => i !== index);
    setLocalSteps(updated);
    onChange(updated);
  };

  const handleStepChange = (index: number, field: keyof NextStepItem, value: string | boolean) => {
    const updated = localSteps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    setLocalSteps(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {localSteps.length === 0 && editable && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-4">No next steps yet</p>
          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add First Step
          </button>
        </div>
      )}

      {localSteps.map((step, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                checked={step.completed}
                onChange={(e) => handleStepChange(index, 'completed', e.target.checked)}
                disabled={!editable}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-3">
              {/* Action */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Action <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={step.action}
                  onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                  placeholder="What needs to be done?"
                  disabled={!editable}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    step.completed ? 'line-through text-gray-500' : ''
                  }`}
                />
              </div>

              {/* Owner & Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Owner
                  </label>
                  <input
                    type="text"
                    value={step.owner || ''}
                    onChange={(e) => handleStepChange(index, 'owner', e.target.value)}
                    placeholder="Who's responsible?"
                    disabled={!editable}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={step.deadline || ''}
                    onChange={(e) => handleStepChange(index, 'deadline', e.target.value)}
                    disabled={!editable}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Delete Button */}
            {editable && (
              <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                className="flex items-center justify-center h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                title="Remove step"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      {editable && localSteps.length > 0 && (
        <button
          type="button"
          onClick={handleAddStep}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Another Step
        </button>
      )}
    </div>
  );
}
