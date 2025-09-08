import { useState, useCallback } from "react";
import { usePage, router } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import InputError from "@/components/common/ErrorInput";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import FacilitySelector from "@/Pages/Merchant/Venue/Partials/FacilitySelector";
import ImageInput from "@/components/merchant/ImageInput";
import AddressSelectInput from "@/components/Common/AddressSelectInput";
import PhoneInput from "@/components/Common/PhoneInput";

export default function VenueForm({
    data,
    setData,
    address,
    setAddress,
    errors,
    processing,
    handleSubmit,
    title,
    mode = "create",
    selectedFacilities,
    setSelectedFacilities,
    images,
    setImages,
}) {
    const { facilities } = usePage().props;

    const handleImageChange = useCallback(
        (newFiles, mainIndex) => {
            setImages(newFiles);
            setData("main_image_index", mainIndex);
        },
        [setImages, setData]
    );

    return (
        <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <h2 className="font-bold text-lg">{title}</h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="p-4 flex flex-col md:flex-row w-full gap-6">
                        <div className="flex flex-col lg:w-4/12 gap-4">
                            <div className="flex flex-row gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Venue :"
                                        className="mb-2 font-bold"
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
                                    <InputError message={errors.name} />
                                </div>

                                {/* Nomor Telepon */}
                                <div>
                                    <InputLabel
                                        htmlFor="phone_number"
                                        value="Nomor Handphone :"
                                        className="mb-2 font-bold"
                                    />
                                    <PhoneInput
                                        id="phone_number"
                                        name="phone_number"
                                        value={data.phone_number ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Deskripsi :"
                                    className="mb-2 font-bold"
                                />
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
                                <InputError message={errors.description} />
                            </div>

                            {/* Lokasi */}
                            <div>
                                <InputLabel
                                    htmlFor="address"
                                    value="Alamat Lengkap :"
                                    className="mb-2 font-bold"
                                />
                                <TextArea
                                    id="full_address"
                                    name="full_address"
                                    placeholder="Jalan, nomor, RT/RW, kecamatan, kota"
                                    value={address.full_address ?? ""}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            full_address: e.target.value,
                                        })
                                    }
                                    className="w-full h-[100px]"
                                />

                                <InputError message={errors.full_address} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="address"
                                    value="Pilih Wilayah :"
                                    className="mb-2 font-bold"
                                />
                                <AddressSelectInput
                                    value={address}
                                    onChange={setAddress}
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="postal_code"
                                    value="Kode Pos :"
                                    className="mb-2 font-bold"
                                />
                                <TextInput
                                    id="postal_code"
                                    name="postal_code"
                                    placeholder="Masukan Kode Pos!"
                                    value={address.postal_code ?? ""}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            postal_code: e.target.value,
                                        })
                                    }
                                    maxLength={5}
                                    className="w-full"
                                />
                                <InputError message={errors.postal_code} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-row gap-4">
                                    <div className="flex-1">
                                        <InputLabel
                                            htmlFor="latitude"
                                            value="Latitude :"
                                            className="mb-2 font-bold"
                                        />
                                        <TextInput
                                            id="latitude"
                                            name="latitude"
                                            placeholder="Masukkan Latitude"
                                            value={data.latitude ?? ""}
                                            onChange={(e) =>
                                                setAddress({
                                                    ...address,
                                                    latitude: e.target.value,
                                                })
                                            }
                                            className="w-full"
                                        />
                                        <InputError message={errors.latitude} />
                                    </div>
                                    <div className="flex-1">
                                        <InputLabel
                                            htmlFor="longitude"
                                            value="Longitude :"
                                            className="mb-2 font-bold"
                                        />
                                        <TextInput
                                            id="longitude"
                                            name="longitude"
                                            placeholder="Masukkan Longitude"
                                            value={data.longitude ?? ""}
                                            onChange={(e) =>
                                                setAddress({
                                                    ...address,
                                                    longitude: e.target.value,
                                                })
                                            }
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.longitude}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-blue-600 underline">
                                    <a
                                        href="https://www.google.com/maps"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        *Klik di sini untuk mencari titik lokasi
                                        di Google Maps
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="flex flex-col gap-8 flex-1">
                            {/* Fasilitas */}
                            <FacilitySelector
                                facilities={facilities}
                                value={selectedFacilities}
                                onChange={setSelectedFacilities}
                            />

                            {/* Upload Gambar */}
                            <div>
                                <InputLabel
                                    value="Gambar Lapangan :"
                                    className="mb-2 font-bold"
                                />
                                <ImageInput
                                    files={images}
                                    onChange={handleImageChange}
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
                                <InputError message={errors.images} />
                            </div>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={processing}
                    >
                        {mode === "edit" ? "Perbarui" : "Tambah"}
                    </Button>
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.visit(route("merchant.venues.index"))
                        }
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
