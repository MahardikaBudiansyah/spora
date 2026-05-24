import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import ImageZoomModal from "@/components/common/ImageZoomModal";
import Button from "@/components/common/Button";

const getImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "") {
        return "/assets/images/court-default.jpg";
    }
    if (path.startsWith("http") || path.startsWith("/storage")) {
        return path;
    }
    return `/storage/${path}`;
};

export default function GalleryImage({
    images = [],
    pathKey = "url",
    className,
}) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [mainImage, setMainImage] = useState("");
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);

    useEffect(() => {
        if (isZoomOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isZoomOpen]);

    useEffect(() => {
        if (images.length > 0) {
            const featured = images.find((img) => img.is_featured) || images[0];
            setMainImage(getImageUrl(featured[pathKey]));
        }
    }, [images, pathKey]);

    const openZoomAt = (e, index) => {
        e.stopPropagation();
        setZoomIndex(index);
        setIsZoomOpen(true);
    };

    const handleScroll = (dir) => {
        const offset = dir === "left" ? -200 : 200;
        scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    };

    if (!images || images.length === 0) {
        return (
            <div className={twMerge("w-full", className)}>
                <img
                    src={getImageUrl(null)}
                    className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg"
                    alt="Default"
                />
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                "flex flex-col gap-4 w-full lg:w-6/12",
                className,
            )}
        >
            <div className="relative group">
                <img
                    src={mainImage}
                    alt="Main"
                    className="w-full h-[250px] lg:h-[400px] object-cover rounded-xl shadow-md transition-all duration-500"
                />
                <Button
                    variant="light"
                    onClick={(e) => {
                        const idx = images.findIndex(
                            (img) => getImageUrl(img[pathKey]) === mainImage,
                        );
                        openZoomAt(e, idx >= 0 ? idx : 0);
                    }}
                    className="absolute bottom-3 right-3  backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Expand className="w-5 h-5" />
                </Button>
            </div>

            <div className="relative group">
                {images.length > 3 && (
                    <div>
                        <Button
                            variant="primary"
                            onClick={() => handleScroll("left")}
                            className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 shadow-lg p-1 rounded-full focus:ring-0 hover:scale-110 transition"
                        >
                            <ChevronLeft size={18} />
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => handleScroll("right")}
                            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 shadow-lg p-1 rounded-full focus:ring-0 hover:scale-110 transition"
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                )}

                <div
                    ref={scrollRef}
                    className="overflow-x-auto scrollbar-hide flex gap-3 pb-2 px-1"
                >
                    {images.map((img, index) => {
                        const imgUrl = getImageUrl(img[pathKey]);
                        const active = imgUrl === mainImage;
                        return (
                            <img
                                key={img.id || index}
                                src={imgUrl}
                                onClick={() => setMainImage(imgUrl)}
                                className={twMerge(
                                    "h-20 aspect-video object-cover rounded-lg cursor-pointer transition-all border-2",
                                    active
                                        ? "border-primary-500 scale-104 shadow-sm"
                                        : "border-transparent opacity-70 hover:opacity-100",
                                )}
                                alt={`Thumb ${index}`}
                            />
                        );
                    })}
                </div>
            </div>

            <ImageZoomModal
                open={isZoomOpen}
                image={getImageUrl(images[zoomIndex]?.[pathKey])}
                onClose={() => setIsZoomOpen(false)}
                onPrev={() =>
                    setZoomIndex(
                        (prev) => (prev - 1 + images.length) % images.length,
                    )
                }
                onNext={() =>
                    setZoomIndex((prev) => (prev + 1) % images.length)
                }
            />
        </div>
    );
}
