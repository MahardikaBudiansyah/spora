const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "teal",
    "orange",
    "lime",
    "cyan",
    "rose",
];

export const getVenueStatus = (status) => {
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

// Fungsi untuk jumlah venue
export const getVenuesCountBadge = (count) => {
    let color = "gray";

    if (count >= 1 && count <= 10) {
        color = colors[count - 1]; // index 0 → count 1
    } else if (count > 10) {
        color = colors[colors.length - 1]; // lebih dari 10 → rose
    }

    return {
        label: count ?? 0,
        color: color,
    };
};

// Fungsi baru untuk jumlah lapangan
export const getVenueFieldsCountBadge = (count) => {
    let color = "gray";

    if (count >= 1 && count <= 10) {
        color = colors[count - 1]; // index 0 → count 1
    } else if (count > 10) {
        color = colors[colors.length - 1]; // lebih dari 10 → rose
    }

    return {
        label: count ?? 0,
        color: color,
    };
};
