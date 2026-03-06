import { useEffect } from "react";
import Navbar from "@/Layouts/Merchant/Navbar";
import Sidenav from "@/Layouts/Merchant/Sidenav";
import Footer from "@/Layouts/Merchant/Footer";
import usePersistentSidebar from "@/hooks/usePersistentSidebar";

export default function MerchantLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = usePersistentSidebar();

    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isSidebarOpen]);

    return (
        <div className="flex flex-col min-h-screen bg-secondary-50 dark:bg-secondary-950 text-secondary-700 dark:text-gray-100 overflow-x-hidden">
            <div
                className={`fixed inset-0 bg-secondary-950/40 z-[55] lg:hidden transition-opacity duration-300 ${
                    isSidebarOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <Sidenav
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div
                className={`flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
                }`}
            >
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />

                <main className="m-4 md:m-2 mt-28 md:mt-24 flex-1">
                    {children}
                </main>

                <Footer className="mt-auto" />
            </div>
        </div>
    );
}
