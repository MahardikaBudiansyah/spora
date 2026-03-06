import { Link } from "@inertiajs/react";
import HeroCarouselSection from "@/components/merchant/HeroCarouselSection";
import AppLogo from "@/components/common/AppLogo";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthMerchantLayout({ children }) {
    return (
        <div className="flex min-h-screen h-full bg-white dark:bg-secondary-900">
            <div className="w-full lg:w-1/2 relative flex flex-col justify-start px-12 py-8">
                <header className="flex justify-between">
                    <Link href={route("home")} className="outline-none">
                        <AppLogo
                            variant="newlogo"
                            className="h-14 md:h-20 w-auto"
                            alt="Spora"
                        />
                    </Link>
                    <div>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="md:m-6 mt-20 md:mt-16 flex-1">{children}</main>
                <footer className="mt-auto py-2 px-8 border-t border-secondary-100 dark:border-secondary-800">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                        <span className="text-xs text-secondary-400 dark:text-secondary-500">
                            © {new Date().getFullYear()}{" "}
                            <a
                                href="/"
                                className="hover:underline font-medium text-primary-600 dark:text-primary-400"
                            >
                                Spora™
                            </a>
                            . All Rights Reserved.
                        </span>
                        <span className="hidden md:inline text-secondary-300">
                            |
                        </span>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-[10px] uppercase tracking-wider text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                            >
                                Bantuan
                            </a>
                            <a
                                href="#"
                                className="text-[10px] uppercase tracking-wider text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                            >
                                Kebijakan
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
            <div className="hidden lg:block w-1/2">
                <HeroCarouselSection />
            </div>
        </div>
    );
}
