export default function ErrorInput({ message, className = "", ...props }) {
    return message ? (
        <p {...props} className={"ml-2 text-sm text-red-600 " + className}>
            *{message}
        </p>
    ) : null;
}
