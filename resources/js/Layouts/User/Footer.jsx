import FooterLogo from "@/components/user/footer/FooterLogo";
import FooterLinkGroup from "@/components/user/footer/FooterLinkGroup";
import FooterSocialIcons from "@/components/user/footer/FooterSocialIcons";
import { router } from "@inertiajs/react";
import BannerSection from "@/components/Common/BannerSection";
// Bagian bawah footer (bisa dipakai sendiri)
export function FooterBottom() {
    return (
        <div className="bg-white dark:bg-dark">
            <div className="mx-auto max-w-screen-lg px-4 pb-10 sm:px-6 lg:px-8">
                <div className="h-10 bg-white dark:bg-dark border-t border-secondary-200 dark:border-secondary-600" />
                {/* <hr className="my-6 border-gray-200 dark:border-gray-700 bg-light dark:bg-dark" /> */}
                <div className="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025{" "}
                        <a href={route("home")} className="hover:underline">
                            Spora™
                        </a>
                        . All Rights Reserved.
                    </span>
                    <FooterSocialIcons />
                </div>
            </div>
        </div>
    );
}

// Footer utama (default)
export default function Footer() {
    const footerSections = [
        {
            title: "Mitra",
            links: [
                { label: "Daftar", href: route("merchant.register") },
                { label: "Login", href: route("merchant.login") },
            ],
        },
        {
            title: "Spora",
            links: [
                { label: "Tentang Kami", href: route("about") },
                { label: "Panduan", href: route("contact") },
            ],
        },
        {
            title: "Legal",
            links: [
                { label: "Kebijakan Privasi", href: "#" },
                { label: "Syarat & Ketentuan", href: "#" },
            ],
        },
    ];

    return (
        <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-700">
            <div className="mx-auto max-w-screen-lg pt-10 px-10 md:px-0">
                <div className="md:flex md:justify-between">
                    <FooterLogo />
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mt-4 md:mt-0 text-sm">
                        {footerSections.map((section, idx) => (
                            <FooterLinkGroup
                                key={idx}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </div>
                </div>

                {/* panggil FooterBottom */}
                <FooterBottom />
            </div>
        </footer>
    );
}
