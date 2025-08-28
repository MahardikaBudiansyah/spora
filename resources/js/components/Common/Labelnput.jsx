import { twMerge } from "tailwind-merge";

export default function LabelInput({
    value,
    className = "",
    children,
    ...props
}) {
    const baseClass =
        "block font-medium text-sm text-gray-700 dark:text-gray-100";

    return (
        <label {...props} className={twMerge(baseClass, className)}>
            {value ?? children}
        </label>
    );
}
