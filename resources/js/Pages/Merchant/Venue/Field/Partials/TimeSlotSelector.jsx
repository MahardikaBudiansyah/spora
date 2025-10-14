import Checkbox from "@/components/Common/Checkbox";
import NumericInput from "@/components/Common/NumericInput";

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
                        <NumericInput
                            value={prices[slot.id] || ""}
                            onChange={(val) =>
                                handlePriceChange(slot.id, val ?? 0)
                            }
                            placeholder="Rp 0"
                            prefix="Rp "
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={0}
                            allowNegative={false}
                            className="w-full text-sm text-right"
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
