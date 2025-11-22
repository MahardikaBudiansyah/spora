export const getAdminStatus = (status) => {
    switch (status) {
        case 0:
        case "0":
            return { label: "Tidak Aktif", color: "red" };
        case 1:
        case "1":
            return { label: "Aktif", color: "green" };
        default:
            return { label: "Unknown", color: "gray" };
    }
};
