import React from "react";
import logo from "@/assets/images/ingkenefutsal-logo.png";
import icon from "@/assets/images/ingkenefutsal-icon.png";
import text from "@/assets/images/ingkenefutsal-text.png";
import original from "@/assets/images/ingkenefutsal-original.png";

const AppLogo = ({
    variant = "default",
    className = "h-8 w-auto",
    alt = "Logo",
}) => {
    let logoPath;

    switch (variant) {
        case "logo":
            logoPath = logo;
            break;
        case "icon":
            logoPath = icon;
            break;
        case "text":
            logoPath = text;
            break;
        default:
            logoPath = original;
    }

    return <img src={logoPath} alt={alt} className={className} />;
};

export default AppLogo;
