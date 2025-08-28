import FooterLogo from "@/components/user/footer/FooterLogo";
import FooterLinkGroup from "@/components/user/footer/FooterLinkGroup";
import FooterSocialIcons from "@/components/user/footer/FooterSocialIcons";

export default function Footer() {
    const footerSections = [
        {
            title: "Merchant",
            links: [
                { label: "Daftar", href: "#" },
                { label: "Login", href: "#" },
            ],
        },
        {
            title: "Ingkenefutsal Web",
            links: [
                { label: "Tentang Kami", href: "#" },
                { label: "Panduan", href: "#" },
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
        <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-700 ">
            <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="md:flex md:justify-between">
                    <FooterLogo />
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mt-4 md:mt-0">
                        {footerSections.map((section, idx) => (
                            <FooterLinkGroup
                                key={idx}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </div>
                </div>

                <hr className="my-6 border-gray-200 dark:border-gray-700" />

                <div className="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025{" "}
                        <a href="#" className="hover:underline">
                            Ingkenefutsal™
                        </a>
                        . All Rights Reserved.
                    </span>
                    <FooterSocialIcons />
                </div>
            </div>
        </footer>
    );
}
