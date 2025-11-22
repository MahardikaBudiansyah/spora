import { useState } from "react";

export default function Avatar({
    src,
    alt = "User avatar",
    size = "md",
    rounded = true,
    className = "",
    fallback,
}) {
    const [imgError, setImgError] = useState(false);

    const sizeClasses = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
        xl: "w-14 h-14 text-lg",
        xxl: "w-20 h-20 text-lg",
        profile: "w-40 h-40 text-lg",
    };

    const avatarSize = sizeClasses[size] || sizeClasses["md"];

    // Selalu pakai rounded-full jika rounded true
    const baseClass = `flex items-center justify-center bg-primary-500 dark:bg-secondary-700 text-white font-medium overflow-hidden ${
        rounded ? "rounded-full" : "rounded"
    } ${avatarSize} ${className}`;

    const isValidSrc = typeof src === "string" && src.trim() !== "";

    if (isValidSrc && !imgError) {
        return (
            <div className={baseClass}>
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return <div className={baseClass}>{fallback || "?"}</div>;
}
