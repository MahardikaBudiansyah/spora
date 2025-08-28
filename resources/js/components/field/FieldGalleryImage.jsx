import React, { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import ModalImageZoom from "@/components/common/ImageZoomModal";

const getImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "") {
        return "/assets/images/field-default.jpg"; // default fallback image
    }

    if (path.startsWith("http") || path.startsWith("/storage")) {
        return path;
    }

    return `/storage/${path}`;
};

export default function FieldGalleryImage({ images = [] }) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [mainImage, setMainImage] = useState(() => {
        const featured = images.find((img) => img.is_featured) || images[0];
        return getImageUrl(featured?.image_path);
    });

    const thumbnails = images.filter(
        (img) => getImageUrl(img.image_path) !== mainImage
    );

    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);

    const openZoomAt = (imgUrl) => {
        const index = images.findIndex(
            (img) => getImageUrl(img.image_path) === imgUrl
        );
        setZoomIndex(index >= 0 ? index : 0);
        setIsZoomOpen(true);
    };

    const handleScrollLeft = () => {
        scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };
    const handleScrollRight = () => {
        scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex flex-col gap-4 w-full lg:w-6/12">
                <div className="relative">
                    <img
                        src={getImageUrl(null)} // pakai fallback default
                        alt="Gambar default"
                        className="w-full h-[250px] lg:h-[400px] object-cover rounded-lg shadow-sm"
                        loading="lazy"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full lg:w-6/12">
            <div className="relative">
                <img
                    src={mainImage}
                    alt="Gambar utama"
                    className="w-full h-[250px] lg:h-[400px] object-cover rounded-lg shadow-sm"
                    loading="lazy"
                />
                <button
                    onClick={() => openZoomAt(mainImage)}
                    className="absolute bottom-2 right-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-md hover:scale-105 transition"
                >
                    <Expand className="w-5 h-5 text-gray-800 dark:text-white" />
                </button>
            </div>

            <div className="relative">
                {thumbnails.length > 0 && (
                    <>
                        <button
                            onClick={handleScrollLeft}
                            className="lg:ml-4 absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black/50 text-gray-600 dark:text-gray-100 p-1 rounded-full shadow-md hover:scale-110 transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleScrollRight}
                            className="lg:mr-4 absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black/50 text-gray-600 dark:text-gray-100 p-1 rounded-full shadow-md hover:scale-110 transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                <div
                    ref={scrollRef}
                    className={`overflow-x-auto scrollbar-hide px-8 w-full select-none ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="flex gap-4">
                        {thumbnails.map((img, index) => {
                            const imgUrl = getImageUrl(img.image_path);
                            const isActive = imgUrl === mainImage;

                            return (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Gambar ${index + 1}`}
                                    className={twMerge(
                                        "h-[100px] aspect-video object-cover rounded-lg shadow-sm cursor-pointer transition duration-300 hover:opacity-80",
                                        isActive &&
                                            "border-4 border-primary-600"
                                    )}
                                    loading="lazy"
                                    onClick={() => setMainImage(imgUrl)}
                                    onDoubleClick={() => openZoomAt(imgUrl)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <ModalImageZoom
                open={isZoomOpen}
                image={getImageUrl(images[zoomIndex]?.image_path)}
                alt={`Image ${zoomIndex + 1}`}
                onClose={() => setIsZoomOpen(false)}
                onPrev={() =>
                    setZoomIndex(
                        (prev) => (prev - 1 + images.length) % images.length
                    )
                }
                onNext={() =>
                    setZoomIndex((prev) => (prev + 1) % images.length)
                }
            />
        </div>
    );
}
