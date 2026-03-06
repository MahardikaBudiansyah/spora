export default function ErrorInput({ message, className = "", ...props }) {
    return message ? (
        <p
            {...props}
            className={
                "ml-2 text-xs text-red-600 dark:text-red-500 " + className
            }
        >
            *{message}
        </p>
    ) : null;
}
