import ErrorLayout from "@/Layouts/ErrorLayout";

export default function Unauthorized401({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="401"
            title="Unauthorized"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
