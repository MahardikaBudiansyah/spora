import ErrorLayout from "@/Layouts/ErrorLayout";

export default function PageExpired419({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="419"
            title="Halaman Kedaluwarsa"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
