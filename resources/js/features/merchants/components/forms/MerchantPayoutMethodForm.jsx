import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import InputError from "@/components/common/ErrorInput";
import Button from "@/components/Common/Button";
import TextInput from "@/components/Common/TextInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import BannerAlert from "@/components/Common/BannerAlert";

import { AnimatePresence } from "framer-motion";
import RadioGroup from "@/components/Common/RadioGroup";
import { RotateCcw } from "lucide-react";

export default function MerchantPayoutMethodForm({
    isEditMode,
    merchant,
    payout,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    onOpenDiscard,
    onClose,
}) {
    const payoutOptions = [
        {
            label: "Rekening Bank",
            value: "bank",
            description: "Transfer ke BCA, Mandiri, BRI, BNI, dll.",
        },
        {
            label: "E-Wallet",
            value: "ewallet",
            description: "Transfer ke GoPay, OVO, Dana, ShopeePay.",
        },
    ];

    const showReset =
        merchant?.status === "approved" &&
        payout?.payout_method_id !== null &&
        payout?.status === "draft";

    return (
        <Card className="relative py-2 rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none space-y-1.5 md:mr-8">
                <h2 className="font-bold text-lg uppercase leading-tight tracking-wide">
                    {isEditMode ? "Data Rekening" : "Data Rekening Baru"}
                </h2>
                <p className="text-xs text-secondary-600 dark:text-secondary-300">
                    Mohon lengkapi{" "}
                    <strong>Metode Pencairan Dana (Rekening)</strong> dengan
                    data yang valid. Perubahan data akan ditinjau terlebih
                    dahulu ketika proses verifikasi data berlangsung. Hubungi
                    tim kami jika terdapat pertanyaan dan permasalahan lebih
                    lanjut.
                </p>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                    <AnimatePresence>
                        {isEditMode && payout?.rejection_reason && (
                            <BannerAlert
                                variant="danger"
                                title="Perhatian: Verifikasi Sebelumnya Ditolak"
                                description={payout.rejection_reason}
                                className="mb-2"
                            />
                        )}
                    </AnimatePresence>

                    <RadioGroup
                        label="Pilih Metode Pencairan Dana (Rekening):"
                        name="type"
                        options={payoutOptions}
                        value={data.type}
                        onChange={(val) => setData("type", val)}
                        size="sm"
                        invalid={!!errors.type}
                        helper={errors.type}
                        className="flex flex-col md:flex-row gap-4 w-full"
                    />

                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="provider_name"
                                value={
                                    data.type === "bank"
                                        ? "Nama Bank:"
                                        : "Nama Dompet Digital:"
                                }
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="provider_name"
                                placeholder={
                                    data.type === "bank"
                                        ? "Contoh: BCA"
                                        : "Contoh: GoPay"
                                }
                                value={data.provider_name}
                                onChange={(e) =>
                                    setData("provider_name", e.target.value)
                                }
                                invalid={!!errors.provider_name}
                            />
                            <InputError message={errors.provider_name} />
                        </div>

                        <div className="w-full">
                            <InputLabel
                                htmlFor="account_number"
                                value={
                                    data.type === "bank"
                                        ? "Nomor Rekening:"
                                        : "Nomor HP / ID Akun:"
                                }
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="account_number"
                                placeholder={
                                    data.type === "bank"
                                        ? "001234xxx"
                                        : "0812xxxx"
                                }
                                value={data.account_number}
                                onChange={(e) =>
                                    setData("account_number", e.target.value)
                                }
                                invalid={!!errors.account_number}
                            />
                            <InputError message={errors.account_number} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="account_holder_name"
                                value="Nama Pemilik Akun:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="account_holder_name"
                                placeholder="Masukkan nama sesuai rekening"
                                value={data.account_holder_name}
                                onChange={(e) =>
                                    setData(
                                        "account_holder_name",
                                        e.target.value,
                                    )
                                }
                                invalid={!!errors.account_holder_name}
                            />
                            <InputError message={errors.account_holder_name} />
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="py-2 px-4 flex justify-between items-center gap-2 border-none">
                    <div>
                        {showReset && (
                            <Button
                                type="button"
                                variant="danger"
                                size="xs"
                                onClick={onOpenDiscard}
                                className="flex gap-1.5 items-center"
                            >
                                <RotateCcw size={14} />
                                Batalkan Perubahan
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            onClick={onClose}
                        >
                            Kembali
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="xs"
                            disabled={processing}
                        >
                            {processing
                                ? "Memproses.."
                                : isEditMode
                                  ? "Perbarui Data"
                                  : "Simpan Data"}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
