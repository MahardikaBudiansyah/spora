export const getUserStatus = (status) => {
    switch (status) {
        case "pending":
            return { label: "Menunggu Verifikasi", color: "orange" };
        case "active":
            return { label: "Aktif", color: "green" };
        case "rejected":
            return { label: "Tidak Aktif", color: "red" };
        default:
            return { label: "Tidak Diketahui", color: "gray" };
    }
};

export const getUserBookingStatus = (count) => {
    const total = Number(count) || 0;

    if (total > 0) {
        return {
            label: `Pernah Booking (${total}x)`,
            color: "green",
        };
    }

    return {
        label: "Belum Pernah",
        color: "gray",
    };
};
