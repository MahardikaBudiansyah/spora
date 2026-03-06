import { twMerge } from "tailwind-merge";

export default function TextArea({
    id,
    name,
    value,
    onChange,
    isError = false,
    className = "",
    ...props
}) {
    const baseClass = twMerge(
        "block w-full rounded-md shadow-sm " +
            "dark:bg-secondary-800 " +
            "border-secondary-300 dark:border-secondary-600 " +
            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
            "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 " +
            "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",

        isError &&
            "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 hover:ring-red-500"
    );

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
