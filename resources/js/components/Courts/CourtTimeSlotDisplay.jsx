import Tabs from "@/components/Common/Tabs";
import TimeSlotDisplay from "@/Pages/Merchant/Venue/Courts/Partials/TimeSlotDisplay";

export default function CourtTimeSlotDisplay({
    timeSlots = [],
    showLabel = false,
}) {
    const weekdaySlots = timeSlots.filter(
        (slot) => slot.day_type === "weekday",
    );
    const weekendSlots = timeSlots.filter(
        (slot) => slot.day_type === "weekend",
    );
    const holidaySlots = timeSlots.filter(
        (slot) => slot.day_type === "holiday",
    );

    const displayTabs = [
        {
            id: "weekday",
            label: "Hari Biasa",
            content: (
                <TimeSlotDisplay
                    slots={weekdaySlots}
                    emptyMessage="Tidak ada jadwal untuk Hari Biasa."
                />
            ),
        },
        {
            id: "weekend",
            label: "Akhir Pekan",
            content: (
                <TimeSlotDisplay
                    slots={weekendSlots}
                    emptyMessage="Tidak ada jadwal untuk Akhir Pekan."
                />
            ),
        },
        {
            id: "holiday",
            label: "Hari Libur",
            content: (
                <TimeSlotDisplay
                    slots={holidaySlots}
                    emptyMessage="Tidak ada jadwal untuk Hari Libur."
                />
            ),
        },
    ];

    return (
        <div className="flex flex-col space-y-1">
            {showLabel && (
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2 ">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                        Jadwal & Harga Lapangan
                    </h3>
                </div>
            )}
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-800 overflow-hidden bg-white dark:bg-secondary-900 mt-4">
                <Tabs tabs={displayTabs} orientation="horizontal" />
            </div>
        </div>
    );
}
