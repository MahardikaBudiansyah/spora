import { useState } from "react";
import ImageZoomModal from "@/components/Common/ImageZoomModal";

export default function Avatar({
    src,
    alt = "User avatar",
    size = "md",
    rounded = true,
    className = "",
    fallback,
    allowZoom = false,
}) {
    const [imgError, setImgError] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const sizeClasses = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
        xl: "w-14 h-14 text-lg",
        "2xl": "w-20 h-20 text-lg",
        "3xl": "w-28 h-28 text-xl",
        "4xl": "w-32 h-32 text-2xl",
        "5xl": "w-40 h-40 text-2xl",
    };

    const avatarSize = sizeClasses[size] || sizeClasses["md"];
    const isValidSrc =
        typeof src === "string" && src.trim() !== "" && !imgError;

    let dynamicBg = "bg-primary-500 dark:bg-secondary-700";
    let objectClass = "object-cover";

    if (isValidSrc) {
        if (src.includes("/assets/avatars/")) {
            const isBoy = src.toLowerCase().includes("boy");
            const isGirl = src.toLowerCase().includes("girl");
            if (isBoy) dynamicBg = "bg-primary-600";
            else if (isGirl) dynamicBg = "bg-pink-600";
            objectClass = "object-contain p-1";
        }
    }

    const baseClass = `flex items-center justify-center ${dynamicBg} text-white font-medium overflow-hidden ${
        rounded ? "rounded-full" : "rounded"
    } ${avatarSize} ${className} ${allowZoom && isValidSrc ? "cursor-zoom-in hover:opacity-90 transition-opacity" : ""}`;

    const handleAvatarClick = () => {
        if (allowZoom && isValidSrc) {
            setIsZoomOpen(true);
        }
    };

    return (
        <>
            <div className={baseClass} onClick={handleAvatarClick}>
                {isValidSrc ? (
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full ${objectClass}`}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span>{fallback || "?"}</span>
                )}
            </div>

            {allowZoom && isValidSrc && (
                <ImageZoomModal
                    open={isZoomOpen}
                    image={src}
                    alt={alt}
                    onClose={() => setIsZoomOpen(false)}
                />
            )}
        </>
    );
}
