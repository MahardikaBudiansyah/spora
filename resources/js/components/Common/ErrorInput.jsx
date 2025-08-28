export default function ErrorInput({ message, className = "", ...props }) {
    return message ? (
        <p {...props} className={"text-sm text-red-600 " + className}>
            {message}
        </p>
    ) : null;
}
