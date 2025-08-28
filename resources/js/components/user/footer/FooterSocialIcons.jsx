import { Facebook, Github, Instagram, Twitter, Youtube } from "lucide-react";

const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

export default function FooterSocialIcons() {
    return (
        <div className="flex mt-4 sm:mt-0 gap-5">
            {socialLinks.map(({ icon: Icon, href, label }, i) => (
                <a
                    key={i}
                    href={href}
                    className="text-secondary-500 hover:text-secondary-900 dark:hover:text-white"
                >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                </a>
            ))}
        </div>
    );
}
