// @/components/Orders/OrderPaymentTransactionSummary
import { useEffect, useState } from "react";
import { CreditCard, Info } from "lucide-react";
import SummarySection from "@/components/cards/SummaryCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import {
    getPaymentType,
    getPaymentMethod,
} from "@/utils/attributes/paymentAttribute";
import { formatFullDateWithDay } from "@/utils/date";

export default function OrderPaymentTransactionSummary({ paymentData }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fileSource =
            Array.isArray(paymentData.proof_of_payment) ||
            paymentData.proof_of_payment instanceof FileList
                ? paymentData.proof_of_payment[0]
                : paymentData.proof_of_payment;

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
        <SummarySection
            title="Informasi Transaksi"
            icon={<CreditCard className="w-4 h-4" />}
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
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-secondary-800">
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

                <div className="pt-3 border-t border-gray-100 dark:border-secondary-800 flex flex-col items-center w-full">
                    <span className="block text-[10px] text-secondary-400 uppercase font-bold mb-3">
                        Bukti Pembayaran
                    </span>
                    {previewUrl ? (
                        <div className="relative w-40 h-52 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <img
                                src={previewUrl}
                                className="w-full h-full object-contain"
                                alt="Preview"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center font-bold text-[10px] text-white">
                                PREVIEW
                            </div>
                        </div>
                    ) : (
                        <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-secondary-400">
                            <Info className="w-6 h-6 mb-2 opacity-20" />
                            <span className="text-xs italic">
                                Belum ada bukti
                            </span>
                        </div>
                    )}
                </div>

                <DescriptionItem
                    label="Waktu Pembayaran"
                    className="pt-3 border-t border-gray-100 dark:border-secondary-800"
                    value={
                        paymentData.payment_date
                            ? `${formatFullDateWithDay(
                                  paymentData.payment_date
                              )} - ${paymentData.payment_time || "00:00"}`
                            : "-"
                    }
                />
            </div>
        </SummarySection>
    );
}
