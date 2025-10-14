import { useEffect, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import FieldForm from "@/Pages/Merchant/Venue/Field/Partials/FieldForm";
import { toast } from "react-toastify";

export default function Edit({ field, venue }) {
    const [selectedSlots, setSelectedSlots] = useState(
        field?.timeslot_ids ?? []
    );
    const [slotPrices, setSlotPrices] = useState(field?.prices ?? {});

    const [images, setImages] = useState(() =>
        (field.images ?? [])
            .filter((img) => img && img.url && img.id)
            .map((img) => ({
                file: null,
                preview: img.url,
                name: img.name,
                size: img.size ?? 0,
                id: img.id,
                isExisting: true,
                is_featured: img.is_featured ?? false,
            }))
    );

    const { data, setData, processing, errors } = useForm({
        name: field?.name ?? "",
        field_type_id: field?.field_type_id ?? "",
        description: field?.description ?? "",
        timeslots: field?.timeslot_ids ?? [],
        venue_id: venue?.id ?? null,
        main_image_index: Math.max(
            (venue.images ?? []).findIndex((img) => img.is_featured),
            0
        ),
    });

    // Set ulang timeslot dan price ketika slot berubah
    useEffect(() => {
        setData("prices", slotPrices);
    }, [slotPrices]);

    useEffect(() => {
        setData("timeslots", selectedSlots);
    }, [selectedSlots]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("field_type_id", data.field_type_id);
        formData.append("description", data.description);
        formData.append("venue_id", data.venue_id);

        selectedSlots.forEach((slot, i) => {
            formData.append(`timeslots[${i}]`, slot);
        });

        Object.entries(slotPrices).forEach(([key, value], i) => {
            formData.append(`price[${key}]`, value);
        });

        images.forEach((img) => {
            if (img && !img.isExisting && img.file) {
                formData.append("images[]", img.file);
            }
        });

        const existingIds = images
            .filter((img) => img.isExisting)
            .map((img) => img.id);
        formData.append("existing_image_ids", JSON.stringify(existingIds));

        //Kirim index gambar utama (featured image)
        formData.append("main_image_index", data.main_image_index);

        // Ambil gambar utama berdasarkan index
        const mainImage =
            images.length > data.main_image_index
                ? images[data.main_image_index]
                : null;

        // Jika gambar utama adalah gambar existing, kirim ID-nya
        if (mainImage?.isExisting && mainImage?.id) {
            formData.append("main_image_id", mainImage.id);
        }

        formData.append("_method", "PUT");

        router.post(
            route("merchant.venues.fields.update", [venue.slug, field.slug]),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                headers: {
                    "X-HTTP-Method-Override": "PUT",
                },
                onSuccess: () => {
                    toast.success("Lapangan berhasil diperbarui!");
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal memperbarui data lapangan.");
                    }
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title="Edit Lapangan" />
            <FieldForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Edit Lapangan"
                mode="edit"
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                slotPrices={slotPrices}
                setSlotPrices={setSlotPrices}
                images={images}
                setImages={setImages}
            />
        </MerchantLayout>
    );
}
