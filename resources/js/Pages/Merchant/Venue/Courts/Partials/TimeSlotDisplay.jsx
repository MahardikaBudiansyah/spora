export default function TimeSlotDisplay({ slots = [], emptyMessage }) {
    if (slots.length === 0) {
        return (
            <div className="p-8 text-center text-secondary-500 text-sm italic">
                {emptyMessage}
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 p-4">
            {slots.map((slot, index) => (
                <div
                    key={index}
                    className="flex flex-col p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700"
                >
                    <span className="text-[10px] uppercase tracking-wider text-secondary-400 font-semibold">
                        Sesi
                    </span>
                    <span className="text-sm font-bold text-secondary-900 dark:text-white">
                        {slot.start_time.substring(0, 5)} -{" "}
                        {slot.end_time.substring(0, 5)}
                    </span>
                    <div className="mt-1 pt-1 border-t border-secondary-200 dark:border-secondary-700">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(slot.price)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
