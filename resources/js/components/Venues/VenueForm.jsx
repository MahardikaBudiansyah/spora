import { router } from "@inertiajs/react";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import ErrorInput from "@/components/Common/ErrorInput";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import ImageInput from "@/components/Common/ImageInput";
import AddressSelectInput from "@/components/Common/AddressSelectInput";
import PhoneInput from "@/components/Common/PhoneInput";

import VenueFacilitySelector from "@/components/Venues/VenueFacilitySelector";
import VenueCategorySelector from "@/components/Venues/VenueCategorySelector";

import { formatFullDate } from "@/utils/date";
import { ArrowLeft, PlusCircle, Save } from "lucide-react";
import HelpTooltip from "@/components/Common/HelpTooltip";

export default function VenueForm({
    merchant,
    venue,
    facilities,
    venue_categories,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    title,
    mode = "create",
}) {
    return (
        <Card className="flex flex-col h-full rounded-md shadow-none">
            <form onSubmit={handleSubmit}>
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:gap-2 items-center md:items-baseline font-bold text-2xl">
                                <span>
                                    {mode === "edit"
                                        ? "Edit Venue"
                                        : "Tambah Venue"}
                                </span>
                                {data.name && (
                                    <span
                                        className={`transition-colors duration-300 ${
                                            data.name !== venue?.name
                                                ? "text-orange-500"
                                                : "text-primary-600 dark:text-primary-500"
                                        }`}
                                    >
                                        {data.name}
                                    </span>
                                )}
                            </div>

                            {mode === "create" && (
                                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                    <div>
                                        <span>Mitra </span>
                                        <span>{merchant?.name}</span>
                                    </div>
                                </div>
                            )}
                            {mode === "edit" && venue && (
                                <div className="text-xs text-secondary-500">
                                    <div>
                                        <span>Ditambahkan: </span>
                                        <span className="font-medium">
                                            {formatFullDate(venue.created_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Terakhir diperbarui: </span>
                                        <span className="font-medium">
                                            {formatFullDate(venue.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4 md:p-6 md min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="p-2 flex-1 overflow-x-auto flex flex-col md:flex-row w-full gap-12">
                        <div className="flex flex-col lg:w-4/12 gap-6">
                            <div className="space-y-2">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Venue:"
                                    className="font-bold"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Contoh: Bagong Futsal"
                                    value={data.name ?? ""}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <ErrorInput message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="font-bold"
                                />
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number ?? ""}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <ErrorInput message={errors.phone_number} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                    <InputLabel
                                        htmlFor="description"
                                        value="Deskripsi:"
                                        className="font-bold"
                                    />
                                    <HelpTooltip text="Tuliskan jam operasional, keunggulan lapangan, atau peraturan khusus." />
                                </div>
                                <TextArea
                                    id="description"
                                    name="description"
                                    placeholder="Tuliskan informasi singkat tentang venue Anda!"
                                    value={data.description ?? ""}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full h-[100px]"
                                />
                                <ErrorInput message={errors.description} />
                            </div>

                            {/* Lokasi */}
                            <div className="space-y-2">
                                <InputLabel
                                    htmlFor="address"
                                    value="Alamat Lengkap:"
                                    className="font-bold"
                                />
                                <TextArea
                                    id="full_address"
                                    name="full_address"
                                    placeholder="Jalan, nomor, RT/RW, kecamatan, kota"
                                    value={data.full_address ?? ""}
                                    onChange={(e) =>
                                        setData("full_address", e.target.value)
                                    }
                                    className="w-full h-[100px]"
                                />

                                <ErrorInput message={errors.full_address} />
                            </div>

                            <div className="space-y-2">
                                <InputLabel
                                    htmlFor="address"
                                    value="Pilih Wilayah:"
                                    className="font-bold"
                                />
                                <AddressSelectInput
                                    value={data}
                                    onChange={setData}
                                />
                                <ErrorInput message={errors.address} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel
                                    htmlFor="postal_code"
                                    value="Kode Pos:"
                                    className="font-bold"
                                />
                                <TextInput
                                    id="postal_code"
                                    name="postal_code"
                                    placeholder="Masukan Kode Pos!"
                                    value={data.postal_code ?? ""}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            postal_code: e.target.value,
                                        })
                                    }
                                    maxLength={5}
                                    className="w-full"
                                />
                                <ErrorInput message={errors.postal_code} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="space-y-2">
                                        <InputLabel
                                            htmlFor="latitude"
                                            value="Latitude:"
                                            className="font-bold"
                                        />
                                        <TextInput
                                            id="latitude"
                                            name="latitude"
                                            placeholder="Contoh: -6.12345"
                                            value={data.latitude ?? ""}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    latitude: e.target.value,
                                                })
                                            }
                                            className="w-full"
                                        />
                                        <ErrorInput message={errors.latitude} />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel
                                            htmlFor="longitude"
                                            value="Longitude:"
                                            className="font-bold"
                                        />
                                        <TextInput
                                            id="longitude"
                                            name="longitude"
                                            placeholder="Contoh: 106.12345"
                                            value={data.longitude ?? ""}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    longitude: e.target.value,
                                                })
                                            }
                                            className="w-full"
                                        />
                                        <ErrorInput
                                            message={errors.longitude}
                                        />
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
                                    , klik kanan pada lokasi venue, lalu salin
                                    koordinat ke kolom di atas.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 flex-1">
                            <VenueCategorySelector
                                venue_categories={venue_categories}
                                value={data.category_ids}
                                onChange={(val) => setData("category_ids", val)}
                                errors={errors.category_ids}
                            />

                            <VenueFacilitySelector
                                facilities={facilities}
                                value={data.facility_ids}
                                onChange={(val) => setData("facility_ids", val)}
                                errors={errors.facility_ids}
                            />

                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <InputLabel
                                        value="Gambar Venue:"
                                        className="font-bold"
                                    />
                                    <HelpTooltip text="Gambar pertama atau yang ditandai bintang akan menjadi foto utama yang muncul di halaman pencarian pelanggan" />
                                </div>

                                <ImageInput
                                    files={data.images}
                                    onChange={(allFiles, mainIndex) => {
                                        setData((prev) => ({
                                            ...prev,
                                            images: allFiles, // Biarkan ImageInput yang menentukan isExisting
                                            main_image_index: mainIndex,
                                        }));
                                    }}
                                    maxFileCount={5}
                                    maxFileSize={2 * 1024 * 1024}
                                    maxTotalSize={10 * 1024 * 1024}
                                    showPreview={true}
                                />
                                <input
                                    type="hidden"
                                    name="main_image_index"
                                    value={data.main_image_index}
                                />

                                <ErrorInput message={errors.images} />
                            </div>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="xs"
                        type="submit"
                        disabled={processing}
                        className="flex gap-2 items-center"
                    >
                        {mode === "edit" ? (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Perbarui</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-4 h-4" />
                                <span>Tambah</span>
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
