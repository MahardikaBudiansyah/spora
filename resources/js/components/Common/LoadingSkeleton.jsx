// resources/js/components/Common/LoadingSkeleton.jsx
export default function LoadingSkeleton({ className = "h-6 w-full" }) {
    return (
        <div
            className={`bg-gray-300 dark:bg-gray-700 animate-pulse rounded ${className}`}
        />
    );
}
