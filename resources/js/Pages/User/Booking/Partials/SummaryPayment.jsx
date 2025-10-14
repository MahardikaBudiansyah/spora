import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import { ChevronRight, TriangleAlert } from "lucide-react";
import { formatRupiah, formatDiscount } from "@/utils/currency";
import { formatShortDate } from "@/utils/date";
import BannerAlert from "@/components/Common/BannerAlert";

export default function SummaryPayment({
    allSlots,
    selectedSlots,
    summary,
    grossAmount,
    selectedPaymentType,
    showSewa,
    setShowSewa,
    earliestDate,
}) {
    // Filter slot yang dipilih
    const selectedItems = allSlots.filter((slot) =>
        selectedSlots.includes(slot.cart_id)
    );

    const firstSlot = selectedItems[0];
    const venuePaymentType = firstSlot?.paymentType;

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                Rincian Pembayaran
            </CardHeader>
            <CardBody className="space-y-2">
                {/* Biaya Sewa */}
                <div>
                    <button
                        onClick={() => setShowSewa(!showSewa)}
                        className="flex justify-between w-full items-center gap-2"
                    >
                        <div className="flex gap-2 items-center">
                            <ChevronRight
                                className={`w-3 h-3 transition-transform ${
                                    showSewa ? "rotate-90" : ""
                                }`}
                            />
                            <span className={showSewa ? "font-bold" : ""}>
                                Biaya Sewa
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            {summary.discount_amount > 0 ? (
                                <>
                                    <span className="line-through text-gray-400">
                                        {formatRupiah(summary.original_total)}
                                    </span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {formatRupiah(summary.final_total)}
                                    </span>
                                </>
                            ) : (
                                <span className={showSewa ? "font-bold" : ""}>
                                    {formatRupiah(summary.original_total)}
                                </span>
                            )}
                        </div>
                    </button>

                    {showSewa && (
                        <ol className="ml-5 space-y-1 list-decimal list-inside text-sm text-gray-600 dark:text-gray-300">
                            {selectedItems.map((slot) => (
                                <li
                                    key={slot.cart_id}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <span className="dark:text-white">
                                            {slot.field_name} (
                                            {formatShortDate(slot.booking_date)}
                                            , {slot.timeslot_name})
                                        </span>
                                        {slot.discount_amount > 0 &&
                                            slot.discount_usage && (
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    Diskon{" "}
                                                    {formatRupiah(
                                                        slot.discount_amount
                                                    )}{" "}
                                                    diterapkan (
                                                    {slot.discount_usage.used}/
                                                    {slot.discount_usage.limit})
                                                </span>
                                            )}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {slot.discount_amount > 0 ? (
                                            <>
                                                <span className="line-through text-gray-400">
                                                    {formatRupiah(
                                                        slot.original_price
                                                    )}
                                                </span>
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    {formatRupiah(
                                                        slot.final_price
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="dark:text-white">
                                                {formatRupiah(slot.final_price)}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Biaya Tambahan */}
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex gap-2 items-center">
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span>Biaya Tambahan</span>
                    </div>
                    <span>{formatRupiah(0)}</span>
                </div>
            </CardBody>

            <CardFooter className="pt-4 border-t space-y-1">
                <div className="flex justify-between font-bold">
                    <span>Total Biaya</span>
                    <span>{formatRupiah(summary.final_total)}</span>
                </div>
                {summary.discount_amount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                        <span>Hemat</span>
                        <span className="font-bold">
                            ({formatRupiah(summary.discount_amount)})
                        </span>
                    </div>
                )}
                <div className="flex justify-between font-bold">
                    <span>
                        Total Pembayaran (
                        {selectedPaymentType === "down_payment"
                            ? "DP dulu"
                            : "Langsung Lunas"}
                        )
                    </span>
                    <span>{formatRupiah(grossAmount)}</span>
                </div>
                {/* Sisa Pembayaran (hanya untuk DP) */}
                {selectedPaymentType === "down_payment" && (
                    <div className="flex justify-between font-bold text-red-500">
                        <span>Sisa Pembayaran</span>
                        <span>
                            {formatRupiah(summary.final_total - grossAmount)}
                        </span>
                    </div>
                )}
                {selectedPaymentType === "down_payment" &&
                    venuePaymentType &&
                    earliestDate && (
                        <BannerAlert
                            type="warning"
                            variant="subtle"
                            size="sm"
                            showIcon={false}
                            title={
                                <div className="flex flex-row gap-2 items-center">
                                    <TriangleAlert className="w-4 h-4 " />{" "}
                                    Perhatian
                                </div>
                            }
                            alignItems="start"
                            typeIconSize="lg"
                        >
                            Sisa pembayaran harus dilunasi paling lambat{" "}
                            <strong>
                                H-{venuePaymentType.full_payment_days_before}{" "}
                                sebelum tanggal {formatShortDate(earliestDate)}
                            </strong>
                            . Jika tidak, DP akan hangus dan booking bisa
                            dibatalkan oleh merchant. Tidak ada pengembalian DP.
                        </BannerAlert>
                    )}
            </CardFooter>
        </Card>
    );
}
