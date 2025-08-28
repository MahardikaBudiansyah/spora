import { twMerge } from "tailwind-merge";

export default function BannerSection({
    height = "h-72",
    backgroundUrl = "/assets/images/banner-section.jpg",
    overlayClass = "bg-gray-700 bg-blend-multiply",
    className = "",
    children,
}) {
    return (
        <section
            className={twMerge(
                height,
                "bg-center bg-cover bg-no-repeat content-center",
                `bg-[url('${backgroundUrl}')]`,
                overlayClass,
                className
            )}
        >
            <div className="px-4 mx-auto max-w-screen-xl flex flex-col gap-4 items-center text-center">
                {children}
            </div>
        </section>
    );
}
