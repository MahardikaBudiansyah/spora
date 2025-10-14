import { createContext, useContext, useState, useEffect } from "react";
import { router } from "@inertiajs/react";

const MembershipContext = createContext();

export const useMembership = () => useContext(MembershipContext);

export const MembershipProvider = ({ children }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Load paket dari localStorage saat init
    useEffect(() => {
        const pkg = localStorage.getItem("selectedMembershipPackage");
        if (pkg) {
            try {
                setSelectedPackage(JSON.parse(pkg));
            } catch (err) {
                console.error("Gagal parse selectedMembershipPackage:", err);
                localStorage.removeItem("selectedMembershipPackage");
            }
        }
    }, []);

    // Fungsi untuk "membeli" paket
    const handleBuy = (pkg) => {
        // simpan paket ke state context
        setSelectedPackage(pkg);

        // simpan ke localStorage agar tetap ada walau reload
        localStorage.setItem("selectedMembershipPackage", JSON.stringify(pkg));

        // redirect ke halaman create
        router.get("/user/memberships/create");
    };

    // Fungsi untuk clear package (misal setelah pembayaran sukses)
    const clearPackage = () => {
        setSelectedPackage(null);
        localStorage.removeItem("selectedMembershipPackage");
    };

    return (
        <MembershipContext.Provider
            value={{ selectedPackage, handleBuy, clearPackage }}
        >
            {children}
        </MembershipContext.Provider>
    );
};
