import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function BannerSection({
    height = "h-72",
    // Berikan list gambar default
    backgroundUrl = [
        "/assets/images/banner-section.jpg",
        // "/assets/images/BannerSection-1.png",
        // "/assets/images/BannerSection-2.png",
        // "/assets/images/BannerSection-3.png",
    ],
    overlayClass = "bg-gray-700/80",
    className = "",
    children,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // 30 menit = 30 * 60 * 1000 ms
        const INTERVAL_TIME = 30 * 60 * 1000;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === backgroundUrl.length - 1 ? 0 : prevIndex + 1
            );
        }, INTERVAL_TIME);

        // Bersihkan interval saat komponen tidak lagi digunakan (unmount)
        return () => clearInterval(timer);
    }, [backgroundUrl.length]);

    return (
        <section
            style={{ backgroundImage: `url(${backgroundUrl[currentIndex]})` }}
            className={twMerge(
                height,
                "relative bg-center bg-cover bg-no-repeat transition-all duration-1000", // Tambah transisi biar halus
                className
            )}
        >
            {/* Overlay */}
            <div className={twMerge("absolute inset-0", overlayClass)} />

            {/* Content */}
            <div className="relative px-4 mx-auto max-w-screen-xl flex flex-col gap-4 items-center justify-center text-center h-full">
                {children}
            </div>
        </section>
    );
}
