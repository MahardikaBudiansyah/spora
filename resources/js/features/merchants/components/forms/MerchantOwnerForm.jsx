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
import ImageInput from "@/components/Common/ImageInput";
import HelpTooltip from "@/components/Common/HelpTooltip";
import { formatTo08 } from "@/utils/numberPhone";
import { AnimatePresence } from "framer-motion";
import SelectInput from "@/components/Common/SelectInput";
import { getGenderOptions } from "@/utils/gender";
import DatePickerInput from "@/components/Common/DatePickerInput";
import { formatFullDate } from "@/utils/date";
import BannerAlert from "@/components/Common/BannerAlert";
import { RotateCcw } from "lucide-react";

export default function MerchantOwnerForm({
    isEditMode,
    merchant,
    owner,
    data,
    setData,
    address,
    setAddress,
    errors,
    previews,
    processing,
    handleSubmit,
    onOpenDiscard,
    onClose,
}) {
    const showReset =
        merchant?.status === "approved" && owner?.status === "draft";

    return (
        <Card className="relative py-2 rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none space-y-1.5 md:mr-8">
                <h2 className="font-bold text-lg uppercase leading-tight tracking-wide">
                    {isEditMode ? "Data Owner" : "Lengkapi Data Owner"}
                </h2>
                <p className="text-xs text-secondary-600 dark:text-secondary-300">
                    Mohon lengkapi <strong>Profil Owner</strong> dengan data
                    yang valid. Perubahan data akan ditinjau terlebih dahulu
                    ketika proses verifikasi data berlangsung. Hubungi tim kami
                    jika terdapat pertanyaan dan permasalahan lebih lanjut.
                </p>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <AnimatePresence>
                        {isEditMode && owner?.rejection_reason && (
                            <BannerAlert
                                variant="danger"
                                title="Perhatian: Verifikasi Sebelumnya Ditolak"
                                description={owner.rejection_reason}
                                className="mb-2"
                            />
                        )}
                    </AnimatePresence>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center">
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap (Sesuai KTP):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="name"
                                placeholder="Masukan Nama Lengkap "
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="gender"
                                value="Jenis Kelamin (Sesuai KTP):"
                                className="text-xs font-bold"
                            />
                            <SelectInput
                                options={getGenderOptions()}
                                value={data.gender}
                                onChange={(val) => setData("gender", val)}
                                isClearable={false}
                                isSearchable={false}
                                placeholder="Pilih Jenis Kelamin..."
                            />
                            <InputError message={errors.gender} />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="nik"
                                value="NIK (Sesuai KTP):"
                                className="text-xs font-bold"
                            />
                            <TextInput
                                id="nik"
                                placeholder="Masukan 16 digit NIK"
                                value={data.nik}
                                onChange={(e) => setData("nik", e.target.value)}
                                className={
                                    data.nik?.length > 0 &&
                                    data.nik?.length !== 16
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {errors.nik ? (
                                <InputError message={errors.nik} />
                            ) : data.nik?.length > 0 &&
                              data.nik?.length !== 16 ? (
                                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                                    *NIK harus tepat 16 digit.
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="date_of_birth"
                                value="Tanggal Lahir (Sesuai KTP):"
                                className="mb-1 text-xs font-bold"
                            />
                            <DatePickerInput
                                value={
                                    formatFullDate(data.date_of_birth)
                                        ? new Date(data.date_of_birth)
                                        : null
                                }
                                onChange={(date) =>
                                    setData("date_of_birth", date)
                                }
                                placeholder="Pilih Tanggal Lahir"
                                maxDate={new Date()}
                                withToolbar={true}
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="email"
                                value="Email Owner:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="contoh@email.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="w-full space-y-1">
                            <InputLabel
                                htmlFor="phone_number"
                                value="No. Handphone:"
                                className="text-xs font-bold"
                            />
                            <PhoneInput
                                id="phone_number"
                                value={formatTo08(data.phone_number)}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                            />
                            <InputError message={errors.phone_number} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <InputLabel
                                value="Upload Pass Foto:"
                                className="mb-2 font-bold text-xs"
                            />

                            <ImageInput
                                allowFeatured={false}
                                maxFileCount={1}
                                files={
                                    data.photo_path
                                        ? [
                                              {
                                                  url: URL.createObjectURL(
                                                      data.photo_path,
                                                  ),
                                                  isExisting: false,
                                              },
                                          ]
                                        : previews.photo_path
                                          ? [
                                                {
                                                    url: previews.photo_path,
                                                    isExisting: true,
                                                },
                                            ]
                                          : []
                                }
                                onChange={(files) =>
                                    setData(
                                        "photo_path",
                                        files[0]?.file || null,
                                    )
                                }
                            />
                            <InputError message={errors.photo_path} />
                        </div>
                        <div className="w-full">
                            <InputLabel
                                value="Upload KTP:"
                                className="mb-2 font-bold text-xs"
                            />

                            <ImageInput
                                allowFeatured={false}
                                maxFileCount={1}
                                files={
                                    data.ktp_photo_path
                                        ? [
                                              {
                                                  url: URL.createObjectURL(
                                                      data.ktp_photo_path,
                                                  ),
                                                  isExisting: false,
                                              },
                                          ]
                                        : previews.ktp_photo_path
                                          ? [
                                                {
                                                    url: previews.ktp_photo_path,
                                                    isExisting: true,
                                                },
                                            ]
                                          : []
                                }
                                onChange={(files) =>
                                    setData(
                                        "ktp_photo_path",
                                        files[0]?.file || null,
                                    )
                                }
                            />
                            <InputError message={errors.ktp_photo_path} />
                        </div>
                        <div className="w-full">
                            <div className="flex gap-2">
                                <InputLabel
                                    value="Upload Foto Selfie:"
                                    className="mb-2 font-bold text-xs"
                                />
                                <HelpTooltip
                                    text="Ambil foto wajah Anda sambil memegang KTP asli. Pastikan wajah dan data di KTP terlihat jelas, tidak blur, dan tidak tertutup jari."
                                    className="w-4 h-4"
                                />
                            </div>

                            <ImageInput
                                allowFeatured={false}
                                maxFileCount={1}
                                files={
                                    data.selfie_photo_path
                                        ? [
                                              {
                                                  url: URL.createObjectURL(
                                                      data.selfie_photo_path,
                                                  ),
                                                  isExisting: false,
                                              },
                                          ]
                                        : previews.selfie_photo_path
                                          ? [
                                                {
                                                    url: previews.selfie_photo_path,
                                                    isExisting: true,
                                                },
                                            ]
                                          : []
                                }
                                onChange={(files) =>
                                    setData(
                                        "selfie_photo_path",
                                        files[0]?.file || null,
                                    )
                                }
                            />
                            <InputError message={errors.selfie_photo_path} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full h-full space-y-1">
                            <InputLabel
                                htmlFor="address"
                                value="Alamat Lengkap (Sesuai KTP):"
                                className="text-xs font-bold"
                            />
                            <TextArea
                                id="full_address"
                                name="full_address"
                                placeholder="Jalan, nomor, RT/RW, kecamatan, kota..."
                                value={address.address ?? ""}
                                onChange={(e) =>
                                    setAddress({
                                        ...address,
                                        address: e.target.value,
                                    })
                                }
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
                            , klik kanan pada lokasi, lalu salin koordinat ke
                            kolom di atas.
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
                            disabled={
                                processing ||
                                !data.nik ||
                                data.nik.length !== 16
                            }
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
