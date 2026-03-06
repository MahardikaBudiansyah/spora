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
import TextArea from "@/components/Common/TextArea";
import AddressSelectInput from "@/components/Common/AddressSelectInput";
import PhoneInput from "@/components/Common/PhoneInput";
import { formatTo08 } from "@/utils/numberPhone";
import { AnimatePresence } from "framer-motion";
import { getBusinessTypeOptions } from "@/utils/businessType";
import SelectInput from "@/components/Common/SelectInput";
import { RotateCcw } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";

export default function MerchantProfileForm({
    isEditMode,
    merchant,
    profile,
    data,
    setData,
    address,
    setAddress,
    errors,
    processing,
    handleSubmit,
    onOpenDiscard,
    onClose,
}) {
    console.log("merchant: ", merchant);
    const showReset =
        merchant.status === "approved" && profile?.status === "draft";

    return (
        <Card className="relative py-2 rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none space-y-1.5 md:mr-4">
                <h2 className="font-bold text-lg uppercase leading-tight tracking-wide">
                    {isEditMode
                        ? "Data Profil Bisnis"
                        : "Lengkapi Data Profil Bisnis"}
                </h2>
                <p className="text-xs text-secondary-600 dark:text-secondary-300">
                    Mohon lengkapi <strong>Profil Bisnis</strong> dengan data
                    yang valid. Perubahan data akan ditinjau terlebih dahulu
                    ketika proses verifikasi data berlangsung. Hubungi tim kami
                    jika terdapat pertanyaan dan permasalahan lebih lanjut.
                </p>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                    <AnimatePresence>
                        {isEditMode && profile?.rejection_reason && (
                            <BannerAlert
                                variant="danger"
                                title="Perhatian: Verifikasi Sebelumnya Ditolak"
                                description={profile.rejection_reason}
                                className="mb-2"
                            />
                        )}
                    </AnimatePresence>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="business_name"
                                value="Nama Perusahaan (Office):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="business_name"
                                placeholder="Masukan Nama Perusahan (Office)"
                                value={data.business_name}
                                onChange={(e) =>
                                    setData("business_name", e.target.value)
                                }
                            />
                            <InputError message={errors.business_name} />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="business_email"
                                value="Email Bisnis (Office):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="business_email"
                                placeholder="Email Perusahaan (Office)"
                                value={data.business_email}
                                onChange={(e) =>
                                    setData("business_email", e.target.value)
                                }
                            />
                            <InputError message={errors.business_email} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center">
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="business_phone_number"
                                value="No. Handphone (Office):"
                                className="text-xs font-bold"
                            />
                            <PhoneInput
                                id="business_phone_number"
                                value={formatTo08(data.business_phone_number)}
                                onChange={(e) =>
                                    setData(
                                        "business_phone_number",
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={errors.business_phone_number}
                            />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="business_type"
                                value="Tipe Perusahaan:"
                                className="text-xs font-bold"
                            />
                            <SelectInput
                                options={getBusinessTypeOptions()}
                                value={data.business_type}
                                onChange={(val) =>
                                    setData("business_type", val)
                                }
                                isClearable={false}
                                isSearchable={false}
                                placeholder="Pilih Tipe Perusahaan..."
                            />
                            <InputError message={errors.business_type} />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="nib"
                                value="NIB (Nomor Induk Berusaha):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="nib"
                                placeholder="Masukan NIB"
                                value={data.nib}
                                onChange={(e) => setData("nib", e.target.value)}
                            />
                            <InputError message={errors.nib} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full h-full space-y-1">
                            <InputLabel
                                htmlFor="address"
                                value="Alamat Lengkap (Office):"
                                className="text-xs font-bold"
                            />
                            <TextArea
                                id="address"
                                name="address"
                                placeholder="Jalan, nomor, RT/RW, kecamatan, kota..."
                                value={address.address ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAddress((prev) => ({
                                        ...prev,
                                        address: val,
                                    }));
                                }}
                                className="w-full h-[176px]"
                            />

                            <InputError message={errors.address} />
                        </div>

                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="address"
                                value="Pilih Wilayah:"
                                className="text-xs font-bold"
                            />
                            <AddressSelectInput
                                value={address}
                                onChange={setAddress}
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full space-y-1">
                                <InputLabel
                                    htmlFor="postal_code"
                                    value="Kode Pos :"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="postal_code"
                                    placeholder="Masukkan Kode Pos..."
                                    value={address.postal_code ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAddress((prev) => ({
                                            ...prev,
                                            postal_code: val,
                                        }));
                                    }}
                                    maxLength={5}
                                />
                                <InputError message={errors.postal_code} />
                            </div>
                            <div className="w-full space-y-1">
                                <InputLabel
                                    htmlFor="latitude"
                                    value="Latitude:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="latitude"
                                    placeholder="Contoh: -6.12345"
                                    value={address.latitude ?? ""}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            latitude: e.target.value,
                                        }))
                                    }
                                />
                                <InputError message={errors.latitude} />
                            </div>
                            <div className="w-full space-y-1">
                                <InputLabel
                                    htmlFor="longitude"
                                    value="Longitude:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="longitude"
                                    placeholder="Contoh: 106.12345"
                                    value={address.longitude ?? ""}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            longitude: e.target.value,
                                        }))
                                    }
                                />
                                <InputError message={errors.longitude} />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-secondary-600 dark:text-secondary-300 leading-relaxed">
                            * Buka{" "}
                            <a
                                href="https://www.google.com/maps"
                                target="_blank"
                                className="text-primary-600 hover:underline font-semibold"
                            >
                                Google Maps
                            </a>
                            , klik kanan pada lokasi kantor (Office), lalu salin
                            koordinat ke kolom di atas.
                        </p>
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
