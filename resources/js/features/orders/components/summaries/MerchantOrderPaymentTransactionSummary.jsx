// @/components/Orders/OrderPaymentTransactionSummary
import { useEffect, useState } from "react";
import { CreditCard, Info } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import ImageZoomModal from "@/components/Common/ImageZoomModal";
import {
    getPaymentType,
    getPaymentMethod,
} from "@/utils/attributes/paymentAttribute";
import { formatFullDateWithDay } from "@/utils/date";

export default function MerchantOrderPaymentTransactionSummary({
    paymentData,
    mode = "booking",
}) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let fileSource = paymentData.proof_of_payment;

        if (Array.isArray(fileSource) && fileSource.length > 0) {
            fileSource = fileSource[0]?.file || fileSource[0];
        } else if (
            fileSource &&
            typeof fileSource === "object" &&
            fileSource.file
        ) {
            fileSource = fileSource.file;
        }

        if (fileSource instanceof File || fileSource instanceof Blob) {
            const url = URL.createObjectURL(fileSource);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (
            typeof fileSource === "string" &&
            fileSource.startsWith("http")
        ) {
            setPreviewUrl(fileSource);
        } else {
            setPreviewUrl(null);
        }
    }, [paymentData.proof_of_payment]);

    return (
        <ContentCard
            variant="elevated"
            title="Informasi Transaksi"
            icon={CreditCard}
        >
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <DescriptionItem
                        label="Tipe"
                        value={
                            getPaymentType(paymentData.payment_type)?.label ||
                            "-"
                        }
                    />
                    <DescriptionItem
                        label="Metode"
                        value={
                            getPaymentMethod(paymentData.payment_method)
                                ?.label || "-"
                        }
                    />
                </div>

                {(paymentData.payment_method === "bank_transfer" ||
                    paymentData.payment_method === "ewallet") && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                        <DescriptionItem
                            label={
                                paymentData.payment_method === "bank_transfer"
                                    ? "Bank"
                                    : "E-Wallet"
                            }
                            value={
                                paymentData.bank ||
                                paymentData.digital_wallet ||
                                "-"
                            }
                        />
                        <DescriptionItem
                            label="Nama Pengirim"
                            value={paymentData.payer_name || "-"}
                        />
                        <DescriptionItem
                            label="No. Referensi"
                            className="col-span-2"
                            value={paymentData.reference_no || "-"}
                        />
                    </div>
                )}

                {(paymentData.payment_method === "bank_transfer" ||
                    paymentData.payment_method === "ewallet") && (
                    <div className="pt-3 border-t border-secondary-100 dark:border-secondary-800 flex flex-col items-center w-full">
                        <span className="block text-[10px] text-secondary-400 uppercase font-bold mb-3">
                            Bukti Pembayaran
                        </span>

                        {previewUrl ? (
                            <>
                                <div className="relative w-32 rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-700 shadow-sm group cursor-pointer">
                                    <img
                                        src={previewUrl}
                                        className="w-full h-auto block"
                                        alt="Preview Bukti Bayar"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-secondary-900/70 backdrop-blur-sm py-1.5 text-center font-bold text-[9px] tracking-widest text-white uppercase">
                                        Preview Bukti
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium"
                                    >
                                        Perbesar
                                    </button>
                                </div>

                                <ImageZoomModal
                                    open={isModalOpen}
                                    image={previewUrl}
                                    alt="Bukti Pembayaran"
                                    onClose={() => setIsModalOpen(false)}
                                />
                            </>
                        ) : (
                            <div className="w-40 h-40 rounded-lg border-2 border-dashed border-secondary-100 dark:border-secondary-700 flex flex-col items-center justify-center text-secondary-400">
                                <Info className="w-6 h-6 mb-2 opacity-20" />
                                <span className="text-xs italic">
                                    Belum ada bukti
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <DescriptionItem
                    label="Waktu Pembayaran"
                    className="pt-3 border-t border-secondary-100 dark:border-secondary-800"
                    value={
                        paymentData.payment_date
                            ? `${formatFullDateWithDay(
                                  paymentData.payment_date,
                              )} - ${paymentData.payment_time || "00:00"}`
                            : "-"
                    }
                />
            </div>
        </ContentCard>
    );
}
