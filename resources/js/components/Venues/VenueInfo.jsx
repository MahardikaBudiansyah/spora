// VenueInfo.jsx
import { tv } from "tailwind-variants";
import { Copy, Dot, Star } from "lucide-react";
import { getCategoryBadge } from "@/utils/attributes/venueAttribute";
import { getSocialMediaAttribute } from "@/utils/attributes/socialMediaAttribute";
import Badge from "@/components/Common/Badge";
import Button from "@/components/Common/Button";
import {
    RiInstagramLine,
    RiFacebookCircleLine,
    RiTwitterXLine,
    RiYoutubeLine,
    RiGlobalLine,
    RiWhatsappLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

const platformIcons = {
    instagram: RiInstagramLine,
    facebook: RiFacebookCircleLine,
    twitter: RiTwitterXLine,
    x: RiTwitterXLine,
    youtube: RiYoutubeLine,
    website: RiGlobalLine,
};

const venueInfo = tv({
    base: "space-y-4",
});

export default function VenueInfo({
    name,
    rating,
    description,
    phone_number,
    address,
    categories = [],
    social_media = [],
    showLabel = false,
    mode = "user",
    className,
}) {
    const isInternal = mode === "admin" || mode === "merchant";

    const formattedLocation = [
        address?.district,
        address?.city?.replace(/KABUPATEN|KOTA/gi, "")?.trim(),
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className={venueInfo({ class: className })}>
            {name && <div className="text-4xl font-bold ">{name}</div>}

            <div className="flex flex-wrap flex-row md:items-center gap-2 text-gray-500">
                <div className="flex items-center gap-1">
                    {rating && !isNaN(rating) && (
                        <div className="flex items-center gap-0.5">
                            <span className="text-yellow-500 font-medium">
                                {(Number(rating) || 0).toFixed(1)}{" "}
                            </span>
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        </div>
                    )}
                    {rating && (formattedLocation || categories.length > 0) && (
                        <Dot className="w-4 h-4 hidden md:block" />
                    )}
                </div>
                <div className="font-medium text-secondary-500 dark:text-secondary-300">
                    {formattedLocation}
                </div>

                {formattedLocation && categories.length > 0 && (
                    <Dot className="w-4 h-4 hidden md:block" />
                )}

                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {categories.map((cat) => {
                            const badgeAttr = getCategoryBadge(cat);
                            return (
                                <Badge
                                    key={cat.id}
                                    color={badgeAttr.color}
                                    className="text-xs px-2 py-0.5 rounded-md font-bold shadow-sm"
                                >
                                    {badgeAttr.label}
                                </Badge>
                            );
                        })}
                    </div>
                )}
            </div>

            {social_media && social_media.length > 0 && (
                <div className="flex flex-wrap gap-3 py-2">
                    {social_media.map((social) => {
                        const attr = getSocialMediaAttribute(social.platform);
                        const Icon = attr.icon;

                        return (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <Badge
                                    color={attr.color}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-md transition-all group-hover:opacity-80 group-hover:scale-105 cursor-pointer shadow-sm"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span className="font-semibold">
                                        {social.username}
                                    </span>
                                </Badge>
                            </a>
                        );
                    })}
                </div>
            )}
            {showLabel && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                            Deskripsi
                        </h3>
                    </div>
                    <p
                        className={twMerge(
                            "leading-relaxed text-sm",
                            description
                                ? "text-secondary-600 dark:text-secondary-400"
                                : "text-secondary-400"
                        )}
                    >
                        {description || "Belum ada deskripsi"}
                    </p>
                </div>
            )}

            <div className="space-y-2">
                {showLabel && (
                    <span className="font-semibold block text-sm text-gray-700 dark:text-gray-200">
                        {isInternal
                            ? "Data Kontak"
                            : "Nomor Telepon / WhatsApp"}
                    </span>
                )}

                <div className="flex items-center gap-3">
                    {isInternal ? (
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <RiWhatsappLine className="w-5 h-5 text-green-500" />
                            <span className="font-mono text-sm font-medium">
                                {phone_number || "-"}
                            </span>
                            <Button
                                variant="ghost"
                                type="button"
                                size="xs"
                                className="h-8 w-8 p-0 focus:ring-0"
                                onClick={() => {
                                    if (phone_number) {
                                        navigator.clipboard.writeText(
                                            phone_number
                                        );
                                        toast.success(
                                            "Nomor Telepon berhasil disalin ke clipboard",
                                            {
                                                position: "bottom-center",
                                                autoClose: 3000,
                                                hideProgressBar: true,
                                                theme: "colored",
                                            }
                                        );
                                    }
                                }}
                                tooltip="Salin Nomor Telepon"
                            >
                                <Copy size={14} />
                            </Button>
                        </div>
                    ) : (
                        <a
                            href={`https://wa.me/${String(
                                phone_number || ""
                            ).replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                        >
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800 group-hover:bg-green-100 transition-colors">
                                <RiWhatsappLine className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-green-600 transition-colors">
                                    {phone_number}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                    Klik untuk chat
                                </span>
                            </div>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
