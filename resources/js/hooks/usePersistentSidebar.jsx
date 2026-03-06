import { useState, useEffect } from "react";

export default function usePersistentSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default true

    // 1. Ambil data dari localStorage hanya sekali saat mount
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-open");
        const isDesktop = window.innerWidth >= 1024;

        if (saved !== null) {
            // Jika di desktop, ikuti saved value. Jika di mobile, paksa tutup.
            setIsSidebarOpen(isDesktop ? JSON.parse(saved) : false);
        } else {
            setIsSidebarOpen(isDesktop);
        }
    }, []);

    // 2. Hanya simpan ke localStorage jika layar ukuran Desktop
    // Supaya status "tutup otomatis" di mobile tidak merusak preferensi desktop
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            localStorage.setItem("sidebar-open", JSON.stringify(isSidebarOpen));
        }
    }, [isSidebarOpen]);

    // 3. Handle perubahan ukuran layar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // Balik ke desktop? Buka lagi (atau ambil dari localStorage jika ingin lebih pro)
                setIsSidebarOpen(true);
            } else {
                // Layar kecil? Tutup.
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Cukup jalankan sekali untuk setup listener

    return [isSidebarOpen, setIsSidebarOpen];
}
