import React, { useState } from "react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import TimeSlotButton from "@/components/Common/TimeSlotButton";
import { Star } from "lucide-react";
import {
    getCourtCategory,
    getCourtSurface,
} from "@/utils/attributes/courtAttribute";

const CourtCard = ({
    court,
    timeslots,
    isOpen,
    onToggle,
    loading,
    isSlotInCart,
    handleAddToCart,
    selectedDate,
    toISODate,
}) => {
    const courtTimeslots = timeslots || [];

    const availableSlots = courtTimeslots.filter(
        (slot) => slot.status_label === "Tersedia",
    );

    const [activeImage, setActiveImage] = useState(court.image);
    const courtImages = court.images || [];
    const surfaceAttr = getCourtSurface(court.surface);

    return (
        <div className="my-6 flex flex-col md:flex-row gap-6 border-b pb-8 border-gray-100 dark:border-secondary-800">
            <div className="relative shrink-0">
                <img
                    src={activeImage}
                    alt={court.name}
                    className="w-full md:w-[350px] h-[220px] object-cover rounded-xl shadow-sm"
                />
                <div className="absolute top-3 left-3">
                    <Badge
                        color={surfaceAttr.color}
                        variant="solid"
                        className="font-semibold"
                    >
                        {surfaceAttr.label}
                    </Badge>
                </div>
                {courtImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                        {courtImages.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveImage(img.url)}
                                className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition ${
                                    activeImage === img.url
                                        ? "border-primary-500 ring-1 ring-primary-500"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={img.url}
                                    className="w-full h-full object-cover"
                                    alt="thumbnail"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-row flex-wrap gap-4 items-center">
                        <h3 className="text-xl font-bold">{court.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            {court.categories?.map((cat, index) => {
                                const catAttr = getCourtCategory(cat.name);
                                return (
                                    <Badge
                                        key={index}
                                        color={catAttr.color}
                                        variant="solid"
                                        className={`flex items-center gap-1 ${
                                            cat.is_primary == 1
                                                ? "font-bold"
                                                : "font-medium"
                                        }`}
                                    >
                                        {cat.is_primary == 1 && (
                                            <Star
                                                size={12}
                                                className="fill-current"
                                            />
                                        )}
                                        {catAttr.label}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-sm line-clamp-3">
                        {court.description || "-"}
                    </p>

                    {court.categories?.some((cat) => cat.notes) && (
                        <div className="space-y-1 pl-3 border-l-2 border-gray-100 dark:border-secondary-700">
                            {court.categories.map(
                                (cat, idx) =>
                                    cat.notes && (
                                        <div
                                            key={idx}
                                            className="flex items-baseline gap-1.5"
                                        >
                                            <span className="text-[10px] text-secondary-600 dark:text-secondary-300 font-bold uppercase tracking-wider">
                                                {cat.label || cat.name}:
                                            </span>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400 italic">
                                                "{cat.notes}"
                                            </p>
                                        </div>
                                    ),
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant={isOpen ? "light" : "primary"}
                            onClick={() => onToggle(court.id)}
                            disabled={loading && !isOpen}
                            className="focus:ring-2"
                        >
                            {loading && !isOpen
                                ? "Memuat..."
                                : isOpen
                                  ? "Tutup Jadwal"
                                  : `${availableSlots.length} Slot Tersedia`}
                        </Button>
                    </div>

                    {isOpen && (
                        <div className="">
                            {loading ? (
                                <div className="text-center py-4 text-sm text-gray-500">
                                    Memperbarui jadwal...
                                </div>
                            ) : courtTimeslots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {courtTimeslots.map((slot) => {
                                        const isSelected = isSlotInCart(
                                            court.id,
                                            slot.timeslot_id,
                                            toISODate(selectedDate),
                                        );

                                        return (
                                            <TimeSlotButton
                                                key={slot.timeslot_id}
                                                slot={slot}
                                                selected={isSelected}
                                                disabled={
                                                    isSelected ||
                                                    slot.status_label !==
                                                        "Tersedia"
                                                }
                                                onClick={() =>
                                                    handleAddToCart(court, slot)
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500 italic">
                                        Tidak ada jadwal tersedia untuk tanggal
                                        ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourtCard);
