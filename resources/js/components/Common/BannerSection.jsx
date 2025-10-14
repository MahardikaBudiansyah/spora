import { twMerge } from "tailwind-merge";

export default function BannerSection({
    height = "h-72",
    backgroundUrl = "/assets/images/banner-section.jpg",
    overlayClass = "bg-gray-700/80", // pakai transparansi lebih rapi
    className = "",
    children,
}) {
    return (
        <section
            style={{ backgroundImage: `url(${backgroundUrl})` }}
            className={twMerge(
                height,
                "relative bg-center bg-cover bg-no-repeat",
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
