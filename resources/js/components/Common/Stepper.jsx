import { twMerge } from "tailwind-merge";
import { Check, Circle } from "lucide-react";

export default function Stepper({
    steps = [],
    currentStep = 0,
    onStepClick = null,
    stepErrors = [],
    isNextDisabled = false,
    className = "",
}) {
    return (
        <div className="w-full">
            <ol className={twMerge("flex items-center w-full", className)}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isError = !!stepErrors[index];

                    const isClickable =
                        index < currentStep ||
                        (index === currentStep + 1 && !isNextDisabled);

                    const Icon = step.icon || Circle;

                    const circleClasses = twMerge(
                        "flex items-center justify-center w-10 h-10 rounded-full transition mb-2 relative z-10",
                        isError
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : isCompleted
                              ? "bg-primary-500 dark:bg-primary-800 text-white hover:bg-primary-600"
                              : isActive
                                ? "bg-primary-300 dark:bg-primary-700 text-primary-600 dark:text-white hover:bg-primary-400 dark:hover:bg-primary-800"
                                : "bg-primary-100 text-primary-600 dark:bg-primary-500 dark:text-white  cursor-not-allowed",
                    );

                    const lineLeftClasses = twMerge(
                        "absolute top-4 left-0 w-1/2 h-1 border-b-4 transition-colors duration-300",
                        index <= currentStep && index !== 0
                            ? "border-primary-500"
                            : "border-primary-100 dark:border-primary-600",
                    );

                    const lineRightClasses = twMerge(
                        "absolute top-4 right-0 w-1/2 h-1 border-b-4 transition-colors duration-300",
                        index < currentStep
                            ? "border-primary-500"
                            : "border-primary-100 dark:border-primary-600",
                    );

                    return (
                        <li
                            key={index}
                            className="relative flex-1 flex flex-col items-center text-center group"
                        >
                            {/* Lines */}
                            {index !== 0 && <div className={lineLeftClasses} />}
                            {index !== steps.length - 1 && (
                                <div className={lineRightClasses} />
                            )}

                            {/* Step Circle */}
                            <button
                                type="button"
                                disabled={!isClickable}
                                onClick={() =>
                                    onStepClick && onStepClick(index)
                                }
                                className={circleClasses}
                                title={
                                    !isClickable
                                        ? "Selesaikan langkah saat ini dulu"
                                        : ""
                                }
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </button>

                            {/* Label */}
                            <span
                                className={twMerge(
                                    "text-xs font-semibold transition-colors",
                                    isError
                                        ? "text-red-500"
                                        : isCompleted || isActive
                                          ? "text-primary-600"
                                          : "text-secondary-400",
                                )}
                            >
                                {step.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
