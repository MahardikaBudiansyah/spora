import { useMemo } from "react";
import ContentCard from "@/components/cards/ContentCard";
import {
    CalendarCheck,
    Clock,
    Info,
    MapPin,
    RectangleEllipsis,
    X,
} from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { formatFullDateWithDay } from "@/utils/date";

export default function MerchantPreviewBooking({
    variant = "plain",
    venue,
    bookingSelections = [],
    onBookingChange,
}) {
    const isEditable = typeof onBookingChange === "function";

    const handleRemoveSlot = (date, courtId, slotId) => {
        if (!isEditable) return;

        onBookingChange((prev) =>
            prev
                .map((day) =>
                    day.date !== date
                        ? day
                        : {
                              ...day,
                              courts: day.courts
                                  .map((court) =>
                                      court.court_id !== courtId
                                          ? court
                                          : {
                                                ...court,
                                                slots: court.slots.filter(
                                                    (slot) =>
                                                        slot.timeslot_id !==
                                                        slotId,
                                                ),
                                            },
                                  )
                                  .filter((court) => court.slots.length > 0),
                          },
                )
                .filter((day) => day.courts.length > 0),
        );
    };

    const bookingStats = useMemo(() => {
        const selections = bookingSelections || [];

        const dailySubtotals = selections.map((dateGroup) => {
            const dayTotal = dateGroup.courts.reduce((courtSum, court) => {
                return (
                    courtSum +
                    court.slots.reduce(
                        (slotSum, slot) => slotSum + Number(slot.price || 0),
                        0,
                    )
                );
            }, 0);
            return { date: dateGroup.date, amount: dayTotal };
        });

        const grandTotal = dailySubtotals.reduce(
            (sum, item) => sum + item.amount,
            0,
        );

        const totalSlotsCount = selections.reduce((sum, day) => {
            const courts = day?.courts || [];
            return (
                sum +
                courts.reduce(
                    (courtSum, court) => courtSum + (court?.slots?.length || 0),
                    0,
                )
            );
        }, 0);

        return { grandTotal, totalSlotsCount, dailySubtotals };
    }, [bookingSelections]);

    return (
        <ContentCard
            variant={variant}
            title="Ringkasan Booking"
            icon={CalendarCheck}
            className="shadow-none"
        >
            {bookingSelections.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center text-secondary-500 dark:text-secondary-400">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                        <Info className="w-6 h-6" />
                    </div>
                    <div className="py-4 font-bold text-xs">
                        <p>Belum ada slot jadwal yang dipilih.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-left text-sm text-secondary-800 dark:text-white">
                            {venue?.name || "Pilih Venue"}
                        </h4>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 text-[10px]">
                                <MapPin size={12} />
                                {venue?.short_address ||
                                    formatDistrictCity(
                                        venue?.address?.district,
                                        venue?.address?.city,
                                    )}
                            </div>
                            <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-[10px]">
                                <Clock className="w-3.5 h-3.5" />
                                {bookingStats.totalSlotsCount} Jadwal Terpilih
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                        {bookingSelections.map((daySelection) => {
                            const dayAmount =
                                bookingStats.dailySubtotals.find(
                                    (item) => item.date === daySelection.date,
                                )?.amount || 0;

                            return (
                                <div
                                    key={daySelection.date}
                                    className="bg-secondary-50 dark:bg-secondary-900/60 p-3 rounded-xl space-y-3 border border-secondary-100 dark:border-secondary-800"
                                >
                                    <div className="text-left text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider border-b border-secondary-200 dark:border-secondary-700 pb-2">
                                        {formatFullDateWithDay(
                                            daySelection.date,
                                        )}
                                    </div>

                                    {daySelection.courts.map((court) => (
                                        <div
                                            key={court.court_id}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary-700 dark:text-secondary-200">
                                                <RectangleEllipsis className="w-3 h-3 text-secondary-500 dark:text-secondary-400" />
                                                {court.court_name}
                                            </div>

                                            <div className="grid gap-2">
                                                {court.slots.map((slot) => (
                                                    <div
                                                        key={slot.timeslot_id}
                                                        className="relative flex items-center justify-between bg-white dark:bg-secondary-900 p-2 rounded-lg border border-secondary-200 dark:border-secondary-800 shadow-sm"
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-[11px] font-bold text-secondary-800 dark:text-secondary-200">
                                                                {slot.start_time.substring(
                                                                    0,
                                                                    5,
                                                                )}{" "}
                                                                -{" "}
                                                                {slot.end_time.substring(
                                                                    0,
                                                                    5,
                                                                )}
                                                            </span>
                                                            <span className="text-[10px] text-secondary-500 dark:text-secondary-400">
                                                                {formatRupiah(
                                                                    slot.price,
                                                                )}
                                                            </span>
                                                        </div>
                                                        {isEditable && (
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveSlot(
                                                                        daySelection.date,
                                                                        court.court_id,
                                                                        slot.timeslot_id,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 text-secondary-400 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Daily Subtotal Area */}
                                    <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                                        <span className="text-[10px] text-secondary-600 dark:text-secondary-400 uppercase font-medium">
                                            Subtotal
                                        </span>
                                        <span className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                                            {formatRupiah(dayAmount)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grand Total Section */}
                    <div className="pt-4 border-t-2 border-dashed border-secondary-100 dark:border-secondary-800 mt-4">
                        <div className="flex justify-between items-center text-left">
                            <span className="text-sm font-bold uppercase text-secondary-500 dark:text-secondary-400">
                                Total Harga Sewa
                            </span>
                            <span className="text-lg font-black text-primary-600 dark:text-primary-500">
                                {formatRupiah(bookingStats.grandTotal)}
                            </span>
                        </div>
                        <p className="text-[10px] text-secondary-400 mt-1 text-left leading-relaxed italic">
                            * Belum termasuk rincian diskon atau biaya tambahan
                            lainnya.
                        </p>
                    </div>
                </div>
            )}
        </ContentCard>
    );
}
