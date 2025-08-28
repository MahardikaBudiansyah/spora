import { twMerge } from "tailwind-merge";
import { Check, Circle } from "lucide-react";

export default function Stepper({
    steps = [],
    currentStep = 0,
    onStepClick = null,
    className = "",
}) {
    return (
        <ol className={twMerge("flex items-center w-full", className)}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFirst = index === 0;
                const isLast = index === steps.length - 1;
                const Icon = step.icon || Circle;

                return (
                    <li
                        key={index}
                        className="relative flex-1 flex flex-col items-center text-center group"
                    >
                        {/* Line sebelah kiri */}
                        {!isFirst && (
                            <div
                                className={twMerge(
                                    "absolute top-4 left-0 w-1/2 h-1 border-b-4",
                                    isCompleted
                                        ? "border-primary-500 dark:border-primary-800"
                                        : isActive
                                        ? "border-primary-300 dark:border-primary-700"
                                        : "border-primary-100 dark:border-primary-500"
                                )}
                            />
                        )}

                        {/* Line sebelah kanan */}
                        {!isLast && (
                            <div
                                className={twMerge(
                                    "absolute top-4 right-0 w-1/2 h-1 border-b-4",
                                    index < currentStep - 1
                                        ? "border-primary-500 dark:border-primary-800"
                                        : index === currentStep - 1
                                        ? "border-primary-500 dark:border-primary-800"
                                        : index === currentStep
                                        ? "border-primary-300 dark:border-primary-700"
                                        : "border-primary-100 dark:border-primary-500"
                                )}
                            />
                        )}

                        {/* Step Circle */}
                        <button
                            type="button"
                            onClick={() => onStepClick && onStepClick(index)}
                            className={twMerge(
                                "flex items-center justify-center w-10 h-10 rounded-full transition mb-2 relative z-10",
                                isCompleted
                                    ? "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-800 dark:hover:bg-primary-900 "
                                    : isActive
                                    ? "bg-primary-300 dark:bg-primary-700 text-primary-600 dark:text-white hover:bg-primary-400 dark:hover:bg-primary-800"
                                    : "bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-500 dark:text-white hover:dark:bg-primary-600"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <Icon className="w-4 h-4" />
                            )}
                        </button>

                        {/* Label */}
                        <span
                            className={twMerge(
                                "text-xs font-semibold",
                                isCompleted
                                    ? "text-primary-600"
                                    : isActive
                                    ? "text-primary-600"
                                    : "text-secondary-400"
                            )}
                        >
                            {step.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
