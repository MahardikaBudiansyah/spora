import ErrorLayout from "@/Layouts/ErrorLayout";

export default function ServerError500({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="500"
            title="Kesalahan Server"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
