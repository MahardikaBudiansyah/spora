import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageZoomModal({
    open,
    image,
    alt = "",
    onClose,
    onPrev,
    onNext,
}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(open);
    }, [open]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev?.();
            if (e.key === "ArrowRight") onNext?.();
        };

        if (open) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose, onPrev, onNext]);

    if (!open) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                show ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            {/* Tombol Close */}
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                onClick={onClose}
            >
                <X size={28} />
            </button>

            {/* Tombol Prev */}
            {onPrev && (
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                >
                    <ChevronLeft size={36} />
                </button>
            )}

            {/* Tombol Next */}
            {onNext && (
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                >
                    <ChevronRight size={36} />
                </button>
            )}

            {/* Gambar */}
            <div
                className={`relative max-w-4xl w-full p-4 transform transition-all duration-300 ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={image}
                    alt={alt}
                    className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg bg-white"
                />
            </div>
        </div>
    );
}
