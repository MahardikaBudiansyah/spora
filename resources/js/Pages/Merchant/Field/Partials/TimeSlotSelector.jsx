import Checkbox from "@/components/Common/Checkbox";
import { NumericFormat } from "react-number-format";

export default function TimeSlotSelector({
    value = [],
    onChange,
    errors,
    prices = {},
    setPrices,
    timeSlots = [],
    gridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
}) {
    const toggleSlot = (slotId) => {
        const newValue = value.includes(slotId)
            ? value.filter((s) => s !== slotId)
            : [...value, slotId];

        onChange(newValue);
    };

    const handlePriceChange = (slotId, newPrice) => {
        setPrices((prevPrices) => ({
            ...prevPrices,
            [slotId]: newPrice,
        }));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className={gridClass}>
                {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={value.includes(slot.id)}
                                onChange={() => toggleSlot(slot.id)}
                            />
                            <span className="text-xs font-bold">
                                {slot.name}
                            </span>
                        </label>
                        <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            decimalScale={0}
                            value={prices[slot.id] || ""}
                            onValueChange={(values) =>
                                handlePriceChange(
                                    slot.id,
                                    values.floatValue ?? 0
                                )
                            }
                            placeholder="Rp 0"
                            className="w-full rounded-md text-sm text-right border-secondary-300 focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-600 dark:bg-secondary-800 dark:border-secondary-700 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 "
                        />
                    </div>
                ))}
            </div>
            {typeof errors === "string" && (
                <div className="text-red-500 text-sm">{errors}</div>
            )}
        </div>
    );
}
