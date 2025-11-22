import ErrorLayout from "@/Layouts/ErrorLayout";

export default function TooManyRequests429({ message, dashboardUrl }) {
    return (
        <ErrorLayout
            code="429"
            title="Terlalu Banyak Permintaan"
            message={message}
            dashboardUrl={dashboardUrl}
        />
    );
}
