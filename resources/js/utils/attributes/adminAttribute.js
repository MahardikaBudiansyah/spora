import {
    CheckCircle2,
    HelpCircle,
    LogOut,
    TriangleAlert,
    XCircle,
} from "lucide-react";

export const getAdminIsActive = (isActive) => {
    if (isActive === true || isActive === 1 || isActive === "1") {
        return {
            label: "Aktif",
            color: "green",
        };
    }

    return {
        label: "Tidak Aktif",
        color: "red",
    };
};

export const getAdminStatus = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
        case "active":
            return { label: "Aktif", color: "green", icon: CheckCircle2 };
        case "inactive":
            return {
                label: "Tidak Aktig",
                color: "amber",
                icon: XCircle,
            };
        case "resign":
            return { label: "Keluar", color: "red", icon: LogOut };
        case "banned":
            return { label: "Akun Diblokir", color: "red", icon: XCircle };
        case "deactivation_requested":
            return {
                label: "Proses Hapus Akun",
                color: "rose",
                icon: TriangleAlert,
            };
        default:
            return {
                label: "Status Tidak Diketahui",
                color: "gray",
                icon: HelpCircle,
            };
    }
};
