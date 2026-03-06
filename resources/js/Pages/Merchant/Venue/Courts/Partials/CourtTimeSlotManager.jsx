import Tabs from "@/components/Common/Tabs";
import TimeSlotSelector from "@/Pages/Merchant/Venue/Courts/Partials/TimeSlotSelector";
import Button from "@/components/Common/Button";
import { Copy } from "lucide-react";

export default function CourtTimeSlotManager({
    timeSlots,
    data,
    setData,
    errors,
}) {
    const handleSlotChange = (dayType, newSlotIds) => {
        setData((prev) => {
            const updatedPrices = { ...prev.prices[dayType] };

            Object.keys(updatedPrices).forEach((id) => {
                if (!newSlotIds.includes(Number(id))) {
                    delete updatedPrices[id];
                }
            });

            return {
                ...prev,
                timeSlots: { ...prev.timeSlots, [dayType]: newSlotIds },
                prices: { ...prev.prices, [dayType]: updatedPrices },
            };
        });
    };

    const updateDayTypePrices = (dayType, newPrices) => {
        setData("prices", {
            ...data.prices,
            [dayType]: newPrices,
        });
    };

    const priceTabs = [
        {
            id: "weekday",
            label: "Hari Biasa",
            content: (
                <div className="space-y-4">
                    <span className="text-sm">
                        Harga untuk Senin sampai Jumat
                    </span>
                    <TimeSlotSelector
                        timeSlots={timeSlots}
                        value={data?.timeSlots?.weekday || []}
                        onChange={(val) => handleSlotChange("weekday", val)}
                        prices={data?.prices?.weekday || {}}
                        setPrices={(val) => updateDayTypePrices("weekday", val)}
                        errors={errors?.["slots.weekday"]}
                    />
                </div>
            ),
        },
        {
            id: "weekend",
            label: "Akhir Pekan",
            content: (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                        <span className="text-sm">
                            Harga untuk Sabtu dan Minggu
                        </span>
                        <div className="flex">
                            <Button
                                variant="ghost"
                                size="xs"
                                type="button"
                                onClick={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        timeSlots: {
                                            ...prev.timeSlots,
                                            weekend: [
                                                ...(prev.timeSlots.weekday ||
                                                    []),
                                            ],
                                        },
                                        prices: {
                                            ...prev.prices,
                                            weekend: {
                                                ...(prev.prices.weekday || {}),
                                            },
                                        },
                                    }));
                                }}
                                className="flex gap-1.5 text-xs text-primary-600 dark:text-primary-500"
                            >
                                <Copy className="w-3 h-3" />
                                Salin dari Hari Biasa
                            </Button>
                        </div>
                    </div>
                    <TimeSlotSelector
                        timeSlots={timeSlots}
                        value={data?.timeSlots?.weekend || []}
                        onChange={(val) => handleSlotChange("weekend", val)}
                        prices={data?.prices?.weekend || {}}
                        setPrices={(val) => updateDayTypePrices("weekend", val)}
                        errors={errors?.["slots.weekend"]}
                    />
                </div>
            ),
        },
        {
            id: "holiday",
            label: "Hari Libur",
            content: (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                        <span className="text-sm">
                            Harga khusus Tanggal Merah
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="ghost"
                                size="xs"
                                type="button"
                                onClick={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        timeSlots: {
                                            ...prev.timeSlots,
                                            holiday: [
                                                ...(prev.timeSlots.weekday ||
                                                    []),
                                            ],
                                        },
                                        prices: {
                                            ...prev.prices,
                                            holiday: {
                                                ...(prev.prices.weekday || {}),
                                            },
                                        },
                                    }));
                                }}
                                className="flex gap-1.5 text-xs text-primary-600 dark:text-primary-500"
                            >
                                <Copy className="w-3 h-3" />
                                Salin dari Hari Biasa
                            </Button>
                            <Button
                                variant="ghost"
                                size="xs"
                                type="button"
                                onClick={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        timeSlots: {
                                            ...prev.timeSlots,
                                            holiday: [
                                                ...(prev.timeSlots.weekend ||
                                                    []),
                                            ],
                                        },
                                        prices: {
                                            ...prev.prices,
                                            holiday: {
                                                ...(prev.prices.weekend || {}),
                                            },
                                        },
                                    }));
                                }}
                                className="flex gap-1.5 text-xs text-primary-600 dark:text-primary-500"
                            >
                                <Copy className="w-3 h-3" />
                                Salin dari Akhir Pekan
                            </Button>
                        </div>
                    </div>
                    <TimeSlotSelector
                        timeSlots={timeSlots}
                        value={data?.timeSlots?.holiday || []}
                        onChange={(val) => handleSlotChange("holiday", val)}
                        prices={data?.prices?.holiday || {}}
                        setPrices={(val) => updateDayTypePrices("holiday", val)}
                        errors={errors?.["slots.holiday"]}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="rounded-xl overflow-hidden">
            <Tabs tabs={priceTabs} orientation="horizontal" />
        </div>
    );
}
