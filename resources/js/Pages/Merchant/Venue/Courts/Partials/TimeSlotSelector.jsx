import Checkbox from "@/components/Common/Checkbox";
import NumericInput from "@/components/Common/NumericInput";

export default function TimeSlotSelector({
    value = [],
    onChange,
    errors,
    prices = {},
    setPrices,
    timeSlots = [],
    gridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4",
}) {
    const toggleSlot = (timeSlotId) => {
        const isCurrentlySelected = value.includes(timeSlotId);
        const newValue = isCurrentlySelected
            ? value.filter((s) => s !== timeSlotId)
            : [...value, timeSlotId];

        onChange(newValue);

        // Tambahan: Jika uncheck, mungkin Anda ingin mengosongkan harganya di state?
        // if (isCurrentlySelected) {
        //     handlePriceChange(timeSlotId, 0);
        // }
    };

    const handlePriceChange = (timeSlotId, newPrice) => {
        setPrices({
            ...prices,
            [timeSlotId]: newPrice,
        });

        if (newPrice > 0 && !value.includes(timeSlotId)) {
            onChange([...value, timeSlotId]);
        } else if (
            (newPrice === 0 || newPrice === "") &&
            value.includes(timeSlotId)
        ) {
            onChange(value.filter((id) => id !== timeSlotId));
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className={gridClass}>
                {timeSlots.map((timeSlot) => {
                    const isSelected = value.includes(timeSlot.id);
                    return (
                        <div key={timeSlot.id} className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={() => toggleSlot(timeSlot.id)}
                                />
                                <span
                                    className={`text-xs font-bold ${
                                        isSelected
                                            ? "text-primary-700 dark:text-primary-500"
                                            : "text-secondary-500 dark:text-secondary-400"
                                    }`}
                                >
                                    {timeSlot.start_time.substring(0, 5)} -{" "}
                                    {timeSlot.end_time.substring(0, 5)}
                                </span>
                            </label>
                            <NumericInput
                                value={prices[timeSlot.id] || ""}
                                onChange={(val) =>
                                    handlePriceChange(timeSlot.id, val ?? 0)
                                }
                                placeholder="Rp 0"
                                prefix="Rp "
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={0}
                                allowNegative={false}
                                className={`w-full text-sm text-right ${
                                    !value.includes(timeSlot.id)
                                        ? "opacity-50"
                                        : ""
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
            {typeof errors === "string" && (
                <div className="text-red-500 text-sm">{errors}</div>
            )}
        </div>
    );
}
