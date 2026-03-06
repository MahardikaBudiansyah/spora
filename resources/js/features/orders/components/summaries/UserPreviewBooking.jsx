import React, { useMemo } from "react";
import { router } from "@inertiajs/react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import {
    CalendarCheck,
    Clock,
    Info,
    RectangleEllipsis,
    X,
    MapPin,
    ArrowLeft,
} from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { formatFullDateWithDay } from "@/utils/date";
import { formatDistrictCity } from "@/utils/address";

export default function UserPreviewBooking({
    venue,
    carts = [],
    toggleSlot,
    selectedSlots = [],
    variant = "plain",
}) {
    const filteredCarts = useMemo(() => {
        return carts
            .map((v) => ({
                ...v,
                dates: v.dates
                    .map((d) => ({
                        ...d,
                        courts: d.courts
                            .map((c) => ({
                                ...c,
                                timeSlots: c.timeSlots.filter((s) =>
                                    selectedSlots.includes(s.cart_id),
                                ),
                            }))
                            .filter((c) => c.timeSlots.length > 0),
                    }))
                    .filter((d) => d.courts.length > 0)
                    .sort((a, b) => new Date(a.date) - new Date(b.date)),
            }))
            .filter((v) => v.dates.length > 0);
    }, [carts, selectedSlots]);

    const bookingStats = useMemo(() => {
        let totalSlotsCount = 0;
        let grandTotal = 0;
        const dailySubtotals = [];

        const allDates = filteredCarts.flatMap((v) => v.dates);

        allDates.forEach((dayGroup) => {
            let dayTotal = 0;
            dayGroup.courts.forEach((courtGroup) => {
                totalSlotsCount += courtGroup.timeSlots.length;
                courtGroup.timeSlots.forEach((slot) => {
                    const price = Number(slot.price || 0);
                    dayTotal += price;
                    grandTotal += price;
                });
            });

            dailySubtotals.push({
                date: dayGroup.date,
                amount: dayTotal,
            });
        });

        return { totalSlotsCount, grandTotal, dailySubtotals };
    }, [filteredCarts]);

    const footerAction =
        filteredCarts.length > 0 ? (
            <div className="flex justify-end">
                <Button
                    size="xs"
                    onClick={() =>
                        router.visit(
                            route("venues.show", venue?.slug || "") +
                                "#timetable",
                        )
                    }
                    className="flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Tambah Slot Jadwal Lainnya
                </Button>
            </div>
        ) : null;

    return (
        <ContentCard
            variant={variant}
            title="Ringkasan Booking"
            icon={CalendarCheck}
            className="shadow-none"
            footer={footerAction}
        >
            {filteredCarts.length === 0 ? (
                <div className="py-8 flex flex-col gap-2 items-center justify-center text-center text-secondary-500 dark:text-secondary-400">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <span className=" mb-4">
                        <p className="font-bold text-sm">
                            Wah, belum ada slot yang dipilih pada keranjangmu...
                        </p>
                        <p className="text-[11px]">
                            Pilih jadwal lapangan favoritmu sekarang.
                        </p>
                    </span>
                    <Button
                        size="xs"
                        onClick={() =>
                            router.visit(
                                route("venues.show", venue?.slug || "") +
                                    "#timetable",
                            )
                        }
                    >
                        Lihat Jadwal
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-left text-sm text-secondary-800 dark:text-white">
                            {venue?.name}
                        </h4>
                        <div className="flex flex-col gap-1">
                            {venue?.address && (
                                <div className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 text-[10px]">
                                    <MapPin className="w-3 h-3" />
                                    {venue?.short_address ||
                                        formatDistrictCity(
                                            venue?.address?.district,
                                            venue?.address?.city,
                                        )}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-[10px]">
                                <Clock className="w-3 h-3" />
                                {bookingStats.totalSlotsCount} Jadwal Terpilih
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                        {filteredCarts[0]?.dates.map((dayGroup, index) => {
                            const dayAmount =
                                bookingStats.dailySubtotals.find(
                                    (item) => item.date === dayGroup.date,
                                )?.amount || 0;

                            const isEarliest = index === 0;

                            return (
                                <div
                                    key={dayGroup.date}
                                    className="bg-secondary-50 dark:bg-secondary-900/60 p-3 rounded-xl space-y-3 border border-secondary-100 dark:border-secondary-800"
                                >
                                    {/* Date Header */}
                                    <div className="text-left text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider border-b border-secondary-200 dark:border-secondary-700 pb-2">
                                        {formatFullDateWithDay(dayGroup.date)}
                                    </div>

                                    {dayGroup.courts.map((courtGroup) => (
                                        <div
                                            key={courtGroup.court.id}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary-700 dark:text-secondary-200">
                                                <RectangleEllipsis className="w-3 h-3 text-secondary-500 dark:text-secondary-400" />
                                                {courtGroup.court.name}
                                            </div>

                                            <div className="grid gap-2">
                                                {courtGroup.timeSlots.map(
                                                    (slot) => (
                                                        <div
                                                            key={slot.cart_id}
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
                                                            <button
                                                                onClick={() =>
                                                                    toggleSlot(
                                                                        slot.cart_id,
                                                                        venue?.id,
                                                                    )
                                                                }
                                                                className="text-secondary-400 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                                        <span className="text-[10px] text-secondary-500 dark:text-secondary-400 uppercase font-medium">
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
                        {/* <p className="text-[10px] text-secondary-400 mt-1 text-left leading-relaxed italic">
                            * Harga ini belum termasuk pajak atau biaya
                            transaksi lainnya.
                        </p> */}
                    </div>
                </div>
            )}
        </ContentCard>
    );
}
