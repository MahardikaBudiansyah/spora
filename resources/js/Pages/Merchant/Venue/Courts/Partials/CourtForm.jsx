import { useCallback, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import CourtTimeSlotManager from "@/Pages/Merchant/Venue/Courts/Partials/CourtTimeSlotManager";
import CourtCategoryManager from "@/Pages/Merchant/Venue/Courts/Partials/CourtCategoryManager";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import InputLabel from "@/components/common/LabelInput";
import TextInput from "@/components/common/TextInput";
import InputError from "@/components/common/ErrorInput";
import TextArea from "@/components/common/TextArea";
import SelectInput from "@/components/common/SelectInput";
import Button from "@/components/common/Button";
import ImageInput from "@/components/common/ImageInput";
import { formatFullDate } from "@/utils/date";
import { ArrowLeft, PlusCircle, Save } from "lucide-react";
import HelpTooltip from "@/components/Common/HelpTooltip";

export default function CourtForm({
    venue,
    court,
    surfaces,
    court_categories,
    timeSlots,
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
                                        ? "Edit Lapangan"
                                        : "Tambah Lapangan"}
                                </span>
                                {data.name && (
                                    <span
                                        className={`transition-colors duration-300 ${
                                            data.name !== court?.name
                                                ? "text-orange-500"
                                                : "text-primary-600 dark:text-primary-500"
                                        }`}
                                    >
                                        {data.name}
                                    </span>
                                )}
                            </div>

                            {mode === "create" && (
                                <div className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">
                                    <span>Venue </span>
                                    <span>{venue.name}</span>
                                </div>
                            )}
                            {mode === "edit" && court && (
                                <div className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">
                                    <div>
                                        <span>Ditambahkan: </span>
                                        <span className="font-bold">
                                            {formatFullDate(court.created_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Terakhir diperbarui: </span>
                                        <span className="font-bold">
                                            {formatFullDate(court.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4 md:p-6 md min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="p-2 flex-1 overflow-x-auto flex flex-col md:flex-row w-full gap-6">
                        <div className="flex flex-col md:flex-row w-full gap-6">
                            <div className="flex flex-col lg:w-3/12 gap-4">
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Lapangan:"
                                        className="font-bold"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        placeholder="Masukan Nama Lapangan"
                                        value={data.name ?? ""}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full"
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="court_surface_id"
                                        value="Tipe Lantai Lapangan:"
                                        className="font-bold"
                                    />
                                    <SelectInput
                                        id="court_surface_id"
                                        name="court_surface_id"
                                        value={data.court_surface_id || ""}
                                        options={(surfaces || []).map(
                                            (type) => ({
                                                label: type.name,
                                                value: type.id,
                                            }),
                                        )}
                                        onChange={(val) =>
                                            setData(
                                                "court_surface_id",
                                                Number(val),
                                            )
                                        }
                                        placeholder="Pilih Tipe Lapangan"
                                        isClearable={false}
                                        isSearchable={false}
                                        className="w-full py-1 px-3"
                                    />

                                    <InputError
                                        className="mt-1"
                                        message={errors.court_surface_id}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="description"
                                        value="Deskripsi:"
                                        className="font-bold"
                                    />
                                    <TextArea
                                        id="description"
                                        name="description"
                                        placeholder="Tuliskan detail lapangan seperti jenis rumput, ukuran, dan pencahayaan."
                                        value={data.description ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-[150px]"
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={errors.description}
                                    />
                                </div>
                            </div>

                            {/* Kolom Kanan */}
                            <div className="flex flex-col gap-8 flex-1">
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="court_categories"
                                        value="Kategori Lapangan:"
                                        className="font-bold"
                                    />
                                    <CourtCategoryManager
                                        categories={court_categories}
                                        selectedCategories={
                                            data.categories || []
                                        }
                                        setData={setData}
                                        errors={errors}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="timeSlots"
                                        value="Pilih Jadwal Jam/Sesi/Slot:"
                                        className="font-bold"
                                    />
                                    <CourtTimeSlotManager
                                        timeSlots={timeSlots}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <InputLabel
                                            value="Gambar Lapangan:"
                                            className="font-bold"
                                        />
                                        <HelpTooltip text="Gambar pertama atau yang ditandai bintang akan menjadi foto utama yang muncul di halaman pencarian pelanggan" />
                                    </div>

                                    <ImageInput
                                        files={data.images}
                                        onChange={(allFiles, mainIndex) => {
                                            setData((prev) => ({
                                                ...prev,
                                                images: allFiles,
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
                                    <InputError
                                        className="mt-1"
                                        message={errors.images}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(
                                route("merchant.venues.courts.index", {
                                    venue: venue.slug,
                                }),
                            )
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
