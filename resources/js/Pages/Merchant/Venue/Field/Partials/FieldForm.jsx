import { useCallback, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import TimeSlotSelector from "@/Pages/Merchant/Venue/Field/Partials/TimeSlotSelector";
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
import SelectInput from "@/components/Common/SelectInput";
import Button from "@/components/Common/Button";
import ImageInput from "@/components/merchant/ImageInput";

export default function FieldForm({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    title,
    mode = "create",
    selectedSlots,
    setSelectedSlots,
    slotPrices,
    setSlotPrices,
    images,
    setImages,
}) {
    const {
        venue = {},
        timeslots = [],
        fieldTypes = [],
        field,
    } = usePage().props;

    const handleImageChange = useCallback(
        (newFiles, mainIndex) => {
            setImages(newFiles);
            setData("main_image_index", mainIndex);
        },
        [setImages, setData]
    );

    useEffect(() => {
        if (mode === "edit" && field?.slots) {
            const selected = field.slots.map((slot) => slot.timeslot_id);
            const prices = {};
            field.slots.forEach((slot) => {
                prices[slot.timeslot_id] = slot.price;
            });

            setSelectedSlots(selected);
            setSlotPrices(prices);
        }
    }, [mode, field]);

    return (
        <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col">
                            <div className="text-2xl font-bold">{title}</div>
                            {mode === "edit" && (
                                <>
                                    <div className="text-xs">
                                        <span>Ditambahkan: </span>
                                        <span>{field.created_at}</span>
                                    </div>
                                    <div className="text-xs">
                                        <span>Terakhir diperbarui: </span>
                                        <span>{field.updated_at}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="p-4 flex flex-col md:flex-row w-full gap-6">
                        {/* Kolom Kiri */}
                        <div className="flex flex-col lg:w-3/12 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lapangan :"
                                    className="mb-2 font-bold"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Masukan Nama Venue"
                                    value={data.name ?? ""}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="field_type"
                                    value="Tipe Lapangan :"
                                    className="mb-2 font-bold"
                                />
                                <SelectInput
                                    id="field_type_id"
                                    name="field_type_id"
                                    value={data.field_type_id || ""}
                                    options={(fieldTypes || []).map((type) => ({
                                        label: type.name,
                                        value: type.id, // number
                                    }))}
                                    onChange={(val) =>
                                        setData("field_type_id", Number(val))
                                    }
                                    placeholder="Pilih Tipe Lapangan"
                                    isClearable={false}
                                    isSearchable={false}
                                    className="w-full py-1 px-3"
                                />

                                <InputError message={errors.field_type_id} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Deskripsi :"
                                    className="mb-2 font-bold"
                                />
                                <TextArea
                                    id="description"
                                    name="description"
                                    placeholder="Tuliskan detail lapangan seperti jenis rumput, ukuran, dan pencahayaan."
                                    value={data.description ?? ""}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full h-[150px]"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="flex flex-col gap-8 flex-1">
                            <div>
                                <InputLabel
                                    htmlFor="timeslots"
                                    value="Pilih Jadwal Jam :"
                                    className="mb-2 font-bold"
                                />
                                <TimeSlotSelector
                                    value={selectedSlots}
                                    onChange={setSelectedSlots}
                                    errors={errors.timeslots}
                                    prices={slotPrices}
                                    setPrices={setSlotPrices}
                                    timeSlots={timeslots}
                                />
                            </div>
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
                            router.get(
                                route("merchant.venues.fields.index", {
                                    venue: venue.slug,
                                })
                            )
                        }
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
