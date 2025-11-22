import ErrorLayout from "@/Layouts/ErrorLayout";

export default function Forbidden403({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="403"
            title="Forbidden"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
