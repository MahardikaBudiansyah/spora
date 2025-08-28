import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import VenueForm from "@/Pages/Merchant/Venue/Partials/VenueForm";
import { toast } from "react-toastify";

export default function Create() {
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [images, setImages] = useState([]);

    const { data, setData, processing, errors } = useForm({
        name: "",
        description: "",
        location: "",
        phone_number: "",
        facility: [],
        images: [],
        main_image_index: 0,
    });

    useEffect(() => {
        setData("facility", selectedFacilities);
    }, [selectedFacilities]);

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
        formData.append("location", data.location);
        formData.append("phone_number", data.phone_number);
        formData.append("main_image_index", data.main_image_index);

        data.facility.forEach((id, index) => {
            formData.append(`facility[${index}]`, id);
        });

        data.images?.forEach((imageObj, index) => {
            if (imageObj.file) {
                formData.append(`images[${index}]`, imageObj.file);
            }
        });

        router.post(route("merchant.venues.store"), formData, {
            forceFormData: true, // ← INERTIA 1.x atau 0.11+
            onSuccess: () => {
                toast.success("Venue berhasil ditambahkan");
                console.log("Data saat submit:", data);
            },
            onError: (errors) => {
                toast.error("Gagal menambahkan venue");
                console.error("Errors:", errors);
                Object.values(errors).forEach((err) => {
                    toast.error(err);
                });
            },
        });
    };

    return (
        <MerchantLayout>
            <Head title="Tambah Venue" />
            <VenueForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Tambah Venue"
                mode="create"
                selectedFacilities={selectedFacilities}
                setSelectedFacilities={setSelectedFacilities}
                images={images}
                setImages={setImages}
                handleImageChange={handleImageChange}
            />
        </MerchantLayout>
    );
}
