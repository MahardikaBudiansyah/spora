export function getBookingStatus(status) {
    switch (status) {
        case "pending":
            return { label: "Belum Bayar", color: "yellow" };
        case "confirmed":
            return { label: "Belum Main", color: "green" };
        case "cancelled":
            return { label: "Dibatalkan", color: "red" };
        case "failed":
            return { label: "Gagal", color: "red" };
        case "expired":
            return { label: "Kadalurasa", color: "red" };
        case "completed":
            return { label: "Selesai Main", color: "blue" };
        default:
            return { label: "Tidak Diketahui", color: "gray" };
    }
}
