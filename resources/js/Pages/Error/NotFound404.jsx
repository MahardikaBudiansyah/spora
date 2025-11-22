import ErrorLayout from "@/Layouts/ErrorLayout";

export default function NotFound404({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="404"
            title="Halaman Tidak Ditemukan"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
