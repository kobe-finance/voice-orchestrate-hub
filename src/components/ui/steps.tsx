
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description?: string;
  completed?: boolean;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Steps: React.FC<StepsProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = step.completed || index < currentStep;
        
        return (
          <div key={index} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full border-2',
              isCompleted 
                ? 'bg-primary border-primary text-white' 
                : isActive 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-gray-100 border-gray-300 text-gray-500'
            )}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            <div className="ml-3 flex-1">
              <p className={cn(
                'text-sm font-medium',
                isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
              )}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500">{step.description}</p>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-4',
                isCompleted ? 'bg-primary' : 'bg-gray-300'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};
