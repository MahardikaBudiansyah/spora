import {
    RiInstagramLine,
    RiFacebookCircleLine,
    RiTwitterXLine,
    RiYoutubeLine,
    RiGlobalLine,
    RiWhatsappLine,
    RiTiktokLine,
} from "react-icons/ri";

export const getSocialMediaAttribute = (platform = "") => {
    const p = platform.toLowerCase();

    const attributes = {
        instagram: {
            icon: RiInstagramLine,
            color: "pink",
            label: "Instagram",
        },
        facebook: {
            icon: RiFacebookCircleLine,
            color: "blue",
            label: "Facebook",
        },
        twitter: {
            icon: RiTwitterXLine,
            color: "slate",
            label: "Twitter / X",
        },
        x: {
            icon: RiTwitterXLine,
            color: "slate",
            label: "X",
        },
        youtube: {
            icon: RiYoutubeLine,
            color: "red",
            label: "YouTube",
        },
        tiktok: {
            icon: RiTiktokLine,
            color: "zinc",
            label: "TikTok",
        },
        whatsapp: {
            icon: RiWhatsappLine,
            color: "green",
            label: "WhatsApp",
        },
        website: {
            icon: RiGlobalLine,
            color: "sky",
            label: "Website",
        },
    };

    return (
        attributes[p] || { icon: RiGlobalLine, color: "gray", label: platform }
    );
};
