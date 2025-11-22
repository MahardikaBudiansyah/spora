import { Link } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import HeroCarouselSection from "@/components/merchant/HeroCarouselSection";
import AppLogo from "@/components/common/AppLogo";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthMerchantLayout({ children }) {
    return (
        <div className="flex min-h-screen h-full bg-white dark:bg-secondary-900">
            <div className="w-full lg:w-1/2 relative flex flex-col justify-start px-12 py-8">
                <header className="flex justify-between">
                    <Link href={route("home")}>
                        <AppLogo
                            variant="newlogo"
                            className="h-14 md:h-20 w-auto"
                            alt="Spora"
                        />
                    </Link>
                    <ThemeToggle />
                </header>
                <main className="max-w-md w-full mx-auto">{children}</main>
                <ToastContainer position="top-right" autoClose={3000} />
                <footer className="absolute bottom-4 right-8 text-xs text-gray-400 dark:text-gray-300">
                    © 2025{" "}
                    <a href="#" className="hover:underline">
                        Spora™
                    </a>
                    . All Rights Reserved.
                </footer>
            </div>
            <div className="hidden lg:block w-1/2">
                <HeroCarouselSection />
            </div>
        </div>
    );
}
