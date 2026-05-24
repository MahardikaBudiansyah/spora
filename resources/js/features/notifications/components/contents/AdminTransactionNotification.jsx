import Button from "@/components/Common/Button";

export default function AdminTransactionNotification({
    activeFilter,
    setFilter,
    getCount,
}) {
    const transactionSubFilterOptions = [
        { id: "all_transactions", label: "Semua Transaksi" },
        { id: "new_order", label: "Pesanan Baru" },
        { id: "payment", label: "Pembayaran" },
        { id: "problem", label: "Masalah/Batal" },
    ];

    return (
        <div className="flex gap-2 px-6 md:px-8 py-3 overflow-x-auto no-scrollbar">
            {transactionSubFilterOptions.map((option) => {
                const count = getCount(option.id);
                return (
                    <Button
                        key={option.id}
                        onClick={() => setFilter(option.id)}
                        size="xs"
                        className={`relative overflow-visible text-xs rounded-md focus:ring-2 whitespace-nowrap ${
                            activeFilter === option.id
                                ? "bg-primary-500 text-white shadow-sm"
                                : "bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100"
                        }`}
                    >
                        {option.label}
                        {count > 0 && (
                            <span className="absolute -top-2 -right-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                                {count > 99 ? "99+" : count}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
