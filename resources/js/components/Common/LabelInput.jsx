import { twMerge } from "tailwind-merge";

export default function LabelInput({
    value,
    className = "",
    children,
    ...props
}) {
    const baseClass =
        "block font-medium text-sm text-secondary-700 dark:text-secondary-200";

    return (
        <label {...props} className={twMerge(baseClass, className)}>
            {value ?? children}
        </label>
    );
}
