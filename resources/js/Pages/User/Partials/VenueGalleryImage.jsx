import { useState } from "react";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";
import ImageZoomModal from "@/components/common/ImageZoomModal"; // Pastikan path benar

function RenderImage({ src, alt, className }) {
    if (!src) return <ImagePlaceholder />;
    return <img src={src} alt={alt} className={className} loading="lazy" />;
}

export default function VenueGalleryImage({ images = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const sortedImages = [...images].sort((a, b) => {
        if (a.is_featured === b.is_featured) return a.order - b.order;
        return a.is_featured ? -1 : 1;
    });

    const openModal = (index = 0) => {
        setModalIndex(index);
        setModalOpen(true);
    };

    const nextImage = () =>
        setModalIndex((i) => (i === sortedImages.length - 1 ? 0 : i + 1));
    const prevImage = () =>
        setModalIndex((i) => (i === 0 ? sortedImages.length - 1 : i - 1));

    return (
        <>
            {/* Layout Utama */}
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[480px]">
                <div className="lg:hidden w-full relative">
                    <div
                        className="relative overflow-hidden rounded-lg shadow-sm"
                        onClick={() => openModal(0)}
                    >
                        <RenderImage
                            src={sortedImages[0]?.url}
                            className="w-full h-[250px] object-cover"
                        />

                        {/* Tombol Indikator Foto di Mobile */}
                        {sortedImages.length > 1 && (
                            <div className="absolute bottom-3 right-3">
                                <button className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                                    <span className="opacity-80">
                                        1 / {sortedImages.length}
                                    </span>
                                    <span className="border-l border-white/30 pl-1.5 tracking-wider">
                                        Lihat Semua
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* DESKTOP VIEW */}
                <div className="hidden lg:flex w-full gap-4">
                    {/* Sisi Kiri: Gambar Utama */}
                    <div className="w-2/3 h-full overflow-hidden rounded-l-xl">
                        <div
                            className="w-full h-full cursor-pointer hover:opacity-95 transition"
                            onClick={() => openModal(0)}
                        >
                            <RenderImage
                                src={sortedImages[0]?.url}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Sisi Kanan: 2 Gambar Stacked */}
                    <div className="w-1/3 flex flex-col gap-4 h-full">
                        <div className="h-1/2 overflow-hidden rounded-tr-xl">
                            <div
                                className="w-full h-full cursor-pointer hover:opacity-95 transition"
                                onClick={() => openModal(1)}
                            >
                                <RenderImage
                                    src={sortedImages[1]?.url}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="relative h-1/2 overflow-hidden rounded-br-xl group">
                            <RenderImage
                                src={sortedImages[2]?.url}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Button */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center transition">
                                <button
                                    onClick={() => openModal(0)}
                                    className="text-white text-xs font-bold bg-primary px-5 py-2.5  transform hover:scale-105 transition"
                                >
                                    +{sortedImages.length - 3} Lihat Semua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Zoom Reusable */}
            <ImageZoomModal
                open={modalOpen}
                image={sortedImages[modalIndex]?.url}
                alt={`Gambar ${modalIndex + 1}`}
                onClose={() => setModalOpen(false)}
                onPrev={prevImage}
                onNext={nextImage}
            />
        </>
    );
}
