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
import ProfileAvatar from "@/components/Common/ProfileAvatar";
import { formatTo08 } from "@/utils/numberPhone";
import { getBusinessTypeOptions } from "@/utils/businessType";
import SelectInput from "@/components/Common/SelectInput";

export default function AdminProfileForm({
    profile,
    isEditMode,
    data,
    setData,
    address,
    setAddress,
    errors,
    handleLogoChange,
    processing,
    handleSubmit,
    onClose,
}) {
    const currentLogo =
        data.logo_path instanceof File
            ? URL.createObjectURL(data.logo_path)
            : data.logo_path;

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none">
                <h2 className="font-bold text-lg">
                    {isEditMode
                        ? `Edit Data Profil Bisnis & Legalitas`
                        : "Lengkapi Data Profil Bisnis & Legalitas"}
                </h2>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center">
                        <ProfileAvatar
                            src={currentLogo}
                            user={{
                                name: profile?.business_name,
                            }}
                            size="3xl"
                            onChange={handleLogoChange}
                            isLoading={processing}
                            className="shadow-none shrink-0 bg"
                        />
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="business_name"
                                value="Nama Perusahaan (Bisnis):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="business_name"
                                placeholder="Masukan Nama Perusahan (Bisnis)"
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
                                value="Email Bisnis (Official):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="business_email"
                                placeholder="Email Bisnis (Official)"
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
                                value="No. Handphone (Official):"
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
                                value="Alamat Lengkap (Official):"
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
                        <p className="mt-2 text-xs text-secondary-500 leading-relaxed">
                            * Buka{" "}
                            <a
                                href="https://www.google.com/maps"
                                target="_blank"
                                className="text-primary-600 hover:underline font-semibold"
                            >
                                Google Maps
                            </a>
                            , klik kanan pada lokasi kantor (official), lalu
                            salin koordinat ke kolom di atas.
                        </p>
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
