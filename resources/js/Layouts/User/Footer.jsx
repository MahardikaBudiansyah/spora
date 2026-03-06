import FooterLogo from "@/components/user/Footer/FooterLogo";
import FooterLinkGroup from "@/components/user/Footer/FooterLinkGroup";
import FooterSocialIcons from "@/components/user/Footer/FooterSocialIcons";

export function FooterBottom() {
    return (
        <div className="bg-white dark:bg-dark">
            <div className="mx-auto max-w-screen-lg px-4 pb-10 sm:px-6 lg:px-8">
                <div className="h-10 bg-white dark:bg-dark border-t border-secondary-200 dark:border-secondary-600" />
                {/* <hr className="my-6 border-gray-200 dark:border-gray-700 bg-light dark:bg-dark" /> */}
                <div className="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-secondary-500 dark:text-secondary-300">
                        © 2025{" "}
                        <a
                            href={route("home")}
                            className="hover:underline outline-none focus-visible:underline focus-visible:text-primary-500 dark:focus-visible:text-primary-400"
                        >
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

                <FooterBottom />
            </div>
        </footer>
    );
}
