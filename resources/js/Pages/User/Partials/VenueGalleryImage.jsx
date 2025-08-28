import { useState } from "react";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";

function RenderImage({ src, alt, className }) {
    if (!src) return <ImagePlaceholder />;
    return <img src={src} alt={alt} className={className} loading="lazy" />;
}

export default function VenueGalleryImage({ images = [] }) {
    // if (images.length === 0) {
    //     return <div>Tidak ada foto tersedia</div>;
    // }
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const sortedImages = [...images].sort((a, b) => {
        if (a.is_featured === b.is_featured) {
            return a.order - b.order;
        }
        return a.is_featured ? -1 : 1;
    });

    const openModal = (index = 0) => {
        setModalIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    // Navigasi modal
    const prevImage = () =>
        setModalIndex((i) => (i === 0 ? sortedImages.length - 1 : i - 1));
    const nextImage = () =>
        setModalIndex((i) => (i === sortedImages.length - 1 ? 0 : i + 1));

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Mobile only */}
                <div className="lg:hidden w-full">
                    <RenderImage
                        src={sortedImages[0]?.image_path}
                        alt={`Gambar utama venue ${sortedImages[0]?.id}`}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex justify-center">
                        <button className="text-sm font-semibold dark:text-white bg-primary px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-90 active:scale-95">
                            Lihat Semua Foto
                        </button>
                    </div>
                </div>

                {/* Desktop only */}
                <div className="hidden lg:flex w-full gap-4">
                    <div className="flex-shrink-0 w-[620px] h-[466px]">
                        <RenderImage
                            src={sortedImages[0]?.image_path}
                            alt={`Gambar utama venue ${sortedImages[0]?.id}`}
                            className="w-full h-[466px] object-cover rounded-lg shadow-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-1 w-full h-[450px] gap-4">
                        <div className="h-1/2">
                            <RenderImage
                                src={sortedImages[1]?.image_path}
                                alt={`Gambar utama venue ${sortedImages[1]?.id}`}
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                loading="lazy"
                            />
                        </div>
                        <div className="relative h-1/2">
                            <RenderImage
                                src={sortedImages[2]?.image_path}
                                alt={`Gambar utama venue ${sortedImages[2]?.id}`}
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-50 rounded-lg flex items-center justify-center">
                                <button
                                    onClick={() => openModal(0)}
                                    className="text-white font-semibold bg-primary px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-90 active:scale-95"
                                >
                                    Lihat Semua Foto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeModal();
                            }}
                            className="absolute top-4 right-6 text-white text-4xl font-bold hover:opacity-80"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:opacity-80"
                            aria-label="Previous image"
                        >
                            &#8249;
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:opacity-80"
                            aria-label="Next image"
                        >
                            &#8250;
                        </button>

                        <img
                            src={sortedImages[modalIndex]?.image_path}
                            alt={`Gambar venue ${sortedImages[modalIndex]?.id}`}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
                            loading="lazy"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
