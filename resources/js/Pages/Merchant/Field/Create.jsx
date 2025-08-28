import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import FieldForm from "@/Pages/Merchant/Field/Partials/FieldForm";
import { toast } from "react-toastify";

export default function Create({ venue, fieldTypes }) {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [slotPrices, setSlotPrices] = useState({});
    const [images, setImages] = useState([]);

    const { data, setData, processing, errors } = useForm({
        name: "",
        field_type_id: "",
        description: "",
        images: [],
        venue_id: venue?.id ?? null,
        main_image_index: 0,
    });

    useEffect(() => {
        setData("timeslots", selectedSlots);
    }, [selectedSlots]);

    useEffect(() => {
        setData("images", images);
    }, [images]);

    const handleImageChange = (newFiles, mainIndex) => {
        setImages(newFiles);
        setData("main_image_index", mainIndex);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("field_type_id", data.field_type_id);
        formData.append("main_image_index", data.main_image_index);

        // Tambahkan file gambar (kalau ada)
        data.images?.forEach((imageObj, index) => {
            if (imageObj.file) {
                formData.append(`images[${index}]`, imageObj.file);
            }
        });

        // Tambahkan slot dan harga
        selectedSlots.forEach((slotId, index) => {
            formData.append(`timeslots[${index}][id]`, slotId);
            formData.append(
                `timeslots[${index}][price]`,
                slotPrices[slotId] || 0
            );
        });

        router.post(
            route("merchant.venues.fields.store", { venue: venue.slug }),
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success("Lapangan berhasil ditambahkan");
                    console.log("Data saat submit:", data);
                },
                onError: (errors) => {
                    toast.error("Gagal menambahkan lapangan");
                    console.error("Errors:", errors);
                    Object.values(errors).forEach((err) => {
                        toast.error(err);
                    });
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title="Tambah Lapangan" />
            <FieldForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Tambah Lapangan"
                mode="create"
                fieldTypes={fieldTypes}
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                slotPrices={slotPrices}
                setSlotPrices={setSlotPrices}
                images={images}
                setImages={setImages}
                handleImageChange={handleImageChange}
            />
        </MerchantLayout>
    );
}
