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
import RadioGroup from "@/components/Common/RadioGroup";

export default function PlatformPayoutForm({
    payout,
    isEditMode,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
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

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none">
                <h2 className="font-bold text-lg">
                    {isEditMode
                        ? "Edit Data Rekening Pencairan Dana"
                        : "Tambah Data Rekening Pencairan Dana"}
                </h2>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                    <RadioGroup
                        label="Pilih Tipe Akun Payout:"
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

                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                    <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={onClose}
                    >
                        Batal
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
                </CardFooter>
            </form>
        </Card>
    );
}
