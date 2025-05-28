import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  id: number;
  name: string;
  completed: boolean;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  onStepClick,
  className
}: ProgressStepsProps) {
  const progressPercentage = Math.round(
    (steps.filter((step) => step.completed).length / steps.length) * 100
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
            {progressPercentage === 100 ? "Complété" : "En cours"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-primary-600">
            {progressPercentage}%
          </span>
        </div>
      </div>
      
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
        <div 
          style={{ width: `${progressPercentage}%` }} 
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
        ></div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-2">
        {steps.map((step) => (
          <div 
            key={step.id}
            onClick={() => onStepClick && onStepClick(step.id)}
            className={cn(
              step.completed ? "text-primary-600 font-medium" : "text-secondary-400",
              onStepClick && "cursor-pointer hover:text-primary-700",
              "text-xs text-center"
            )}
          >
            <div 
              className={cn(
                "w-6 h-6 mb-1 mx-auto rounded-full flex items-center justify-center text-white",
                step.completed ? "bg-primary-500" : 
                currentStep === step.id ? "bg-primary-400" : "bg-secondary-300"
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span>{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
