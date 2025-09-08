import { twMerge } from "tailwind-merge";

export default function TextArea({
    id,
    name,
    value,
    onChange,
    className = "",
    ...props
}) {
    const baseClass =
        "border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 hover:border-primary-500 dark:hover:border-primary-500 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-md shadow-sm " +
        "placeholder:text-xs placeholder-secondary-400 dark:placeholder-secondary-500";

    return (
        <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={twMerge(baseClass, className)}
            {...props}
        />
    );
}
