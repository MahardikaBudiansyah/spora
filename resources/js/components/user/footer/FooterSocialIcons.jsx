import IconButton from "@/components/Common/IconButton";
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
            {socialLinks.map(
                ({ icon: Icon, href, label, label: tooltip }, i) => (
                    <IconButton
                        key={i}
                        href={href}
                        tooltip={tooltip}
                        variant="light"
                        className="rounded-full border-none text-secondary-500 hover:text-secondary-600 dark:hover:text-white outline-none bg-transparent dark:bg-transparent"
                    >
                        <Icon className="w-4 h-4" />
                        <span className="sr-only">{label}</span>
                    </IconButton>
                ),
            )}
        </div>
    );
}
