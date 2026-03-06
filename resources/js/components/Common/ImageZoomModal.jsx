import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
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

    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    const minSwipeDistance = 50;

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setShow(true), 10);
            // Mencegah background scroll saat modal buka
            document.body.style.overflow = "hidden";
            return () => clearTimeout(timer);
        } else {
            setShow(false);
            document.body.style.overflow = "unset";
        }
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

    const onTouchStart = (e) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && onNext) {
            onNext();
        } else if (isRightSwipe && onPrev) {
            onPrev();
        }
    };

    if (!open) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300 ${
                show ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <button
                className="absolute top-6 right-6 z-[10001] text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X size={24} />
            </button>

            {onPrev && (
                <button
                    className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition z-[10001]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                >
                    <ChevronLeft size={48} />
                </button>
            )}

            {onNext && (
                <button
                    className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition z-[10001]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                >
                    <ChevronRight size={48} />
                </button>
            )}

            <div
                className={`relative max-w-[95vw] md:max-w-5xl transition-all duration-300 ease-out ${
                    show ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={image}
                    alt={alt}
                    className="w-auto h-auto max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-md shadow-2xl select-none"
                    draggable="false"
                />
            </div>

            <div className="absolute bottom-10 text-white/40 text-[10px] tracking-widest uppercase md:hidden pointer-events-none">
                Geser untuk navigasi
            </div>
        </div>,
        document.body
    );
}
