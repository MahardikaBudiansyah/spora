import ErrorLayout from "@/Layouts/ErrorLayout";

export default function ServiceUnavailable503({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="503"
            title="Layanan Tidak Tersedia"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
