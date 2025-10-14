export function getBookingStatus(status) {
    switch (status) {
        case "pending":
            return { label: "Belum Bayar", color: "yellow" };
        case "confirmed":
            return { label: "Belum Main", color: "green" };
        case "cancelled":
            return { label: "Dibatalkan", color: "red" };
        case "completed":
            return { label: "Selesai Main", color: "blue" };
        default:
            return { label: "Tidak Diketahui", color: "gray" };
    }
}
