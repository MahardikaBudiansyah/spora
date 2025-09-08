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
        phone_number: "",
        facility: [],
        images: [],
        main_image_index: 0,
    });

    const [address, setAddress] = useState({
        full_address: "",
        province_code: null,
        city_code: null,
        district_code: null,
        village_code: null,
        postal_code: "",
        latitude: "",
        longitude: "",
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

        // Merge address ke data sebelum submit
        const submitData = {
            ...data,
            full_address: address.full_address,
            province_code: address.province_code,
            city_code: address.city_code,
            district_code: address.district_code,
            village_code: address.village_code,
            postal_code: address.postal_code,
            latitude: address.latitude,
            longitude: address.longitude,
        };

        const formData = new FormData();
        formData.append("name", submitData.name);
        formData.append("description", submitData.description);
        formData.append("phone_number", submitData.phone_number);
        formData.append("main_image_index", submitData.main_image_index);
        formData.append("full_address", submitData.full_address ?? "");
        formData.append("province_code", submitData.province_code ?? "");
        formData.append("city_code", submitData.city_code ?? "");
        formData.append("district_code", submitData.district_code ?? "");
        formData.append("village_code", submitData.village_code ?? "");
        formData.append("postal_code", submitData.postal_code ?? "");
        formData.append("latitude", submitData.latitude ?? "");
        formData.append("longitude", submitData.longitude ?? "");

        data.facility.forEach((id, index) => {
            formData.append(`facility[${index}]`, id);
        });

        data.images?.forEach((imageObj, index) => {
            if (imageObj.file) {
                formData.append(`images[${index}]`, imageObj.file);
            }
        });

        router.post(route("merchant.venues.store"), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Venue berhasil ditambahkan");
            },
            onError: (errors) => {
                toast.error("Gagal menambahkan venue");
                console.error("Errors:", errors);
            },
        });
    };

    return (
        <MerchantLayout>
            <Head title="Tambah Venue" />
            <VenueForm
                data={data}
                setData={setData}
                address={address}
                setAddress={setAddress}
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
