import { usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import Button from "@/components/Common/Button";

export default function VenueFieldList({ fields = [] }) {
    const { auth } = usePage().props;

    const isMerchant = auth?.merchant;
    const isAdmin = auth?.admin;
    if (!isMerchant && !isAdmin) return null;

    // Scroll drag state
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
        const walk = (x - startX) * 1.5; // sensitivitas
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleInfo = (field) => console.log("Info:", field);
    const handleEdit = (field) => console.log("Edit:", field);
    const handleCalendar = (field) => console.log("Kalender:", field);

    if (!fields || fields.length === 0) {
        return (
            <div className="text-sm text-center text-gray-500">
                Belum ada lapangan yang ditambahkan.
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className={`overflow-x-auto scrollbar-hide px-2 w-full select-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="flex gap-4 w-max">
                {fields.slice(0, 6).map((field) => (
                    <div
                        key={field.id}
                        className="relative w-[300px] lg:w-[360px] h-60 flex-shrink-0 rounded-lg overflow-hidden shadow-md group"
                    >
                        <img
                            src={
                                field.image ||
                                "/assets/images/field-default.jpg"
                            }
                            alt={field.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                        <div className="absolute top-0 left-0 right-0 p-3 z-10 flex items-center justify-between">
                            <span className="text-white font-bold text-sm sm:text-base">
                                {field.name}
                            </span>
                            <span className="bg-white text-black text-xs px-2 py-1 rounded">
                                {field.type}
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex gap-2 justify-end">
                            <Button
                                variant="info"
                                size="xs"
                                onClick={() => handleInfo(field)}
                            >
                                Info
                            </Button>

                            {isMerchant && (
                                <>
                                    <Button
                                        variant="success"
                                        size="xs"
                                        onClick={() => handleEdit(field)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="xs"
                                        onClick={() => handleCalendar(field)}
                                    >
                                        Kalender
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
