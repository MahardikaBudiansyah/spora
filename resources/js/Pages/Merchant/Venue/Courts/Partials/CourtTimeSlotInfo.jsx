import Tabs from "@/components/Common/Tabs";
import TimeSlotButton from "@/components/Common/TimeSlotButton";

export default function CourtTimeSlotInfo({ timeSlots = [] }) {
    // 1. Grouping data berdasarkan day_type
    const groupedSlots = {
        weekday: timeSlots.filter((slot) => slot.day_type === "weekday"),
        weekend: timeSlots.filter((slot) => slot.day_type === "weekend"),
        holiday: timeSlots.filter((slot) => slot.day_type === "holiday"),
    };

    const renderSlotGrid = (slots) => {
        if (!slots || slots.length === 0) {
            return (
                <div className="py-12 text-center border-2 border-dashed rounded-xl text-secondary-400">
                    Tidak ada master slot yang diatur untuk kategori ini.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 py-4">
                {slots.map((slot) => (
                    <TimeSlotButton
                        key={slot.id}
                        slot={{
                            ...slot,
                            status_label: "Tersedia",
                        }}
                        readOnly={true}
                        selected={false}
                    />
                ))}
            </div>
        );
    };

    const tabs = [
        {
            id: "weekday",
            label: "Hari Biasa",
            content: renderSlotGrid(groupedSlots.weekday),
        },
        {
            id: "weekend",
            label: "Akhir Pekan",
            content: renderSlotGrid(groupedSlots.weekend),
        },
        {
            id: "holiday",
            label: "Hari Libur",
            content: renderSlotGrid(groupedSlots.holiday),
        },
    ];

    return (
        <div className="mt-8 pt-8 border-t border-secondary-100 dark:border-secondary-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                    Konfigurasi Slot & Harga Master
                </h3>
            </div>

            <div className="rounded-xl">
                <Tabs tabs={tabs} orientation="horizontal" />
            </div>
        </div>
    );
}
