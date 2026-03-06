import React from "react";
import logo from "@/assets/images/ingkenefutsal-logo.png";
import newlogo from "@/assets/logo/logo-1.png";
import newlogo2 from "@/assets/logo/logo-2.png";
import newlogo3 from "@/assets/logo/logo-3.png";
import newlogo4 from "@/assets/logo/logo-4.png";
import newlogo5 from "@/assets/logo/logo-5.png";
import newlogo6 from "@/assets/logo/logo-6.png";
import newlogo7 from "@/assets/logo/logo-7.png";
import icon from "@/assets/images/ingkenefutsal-icon.png";
import text from "@/assets/images/ingkenefutsal-text.png";
import original from "@/assets/images/ingkenefutsal-original.png";

const AppLogo = ({
    variant = "default",
    className = "h-8 w-auto outline-none focus:outline-none border-none focus:border-none",
    alt = "Logo",
}) => {
    let logoPath;

    switch (variant) {
        case "logo":
            logoPath = logo;
            break;
        case "newlogo":
            logoPath = newlogo;
            break;
        case "newlogo2":
            logoPath = newlogo2;
            break;
        case "newlogo3":
            logoPath = newlogo3;
            break;
        case "newlogo4":
            logoPath = newlogo4;
            break;
        case "newlogo5":
            logoPath = newlogo5;
            break;
        case "newlogo6":
            logoPath = newlogo6;
            break;
        case "newlogo7":
            logoPath = newlogo7;
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
