import { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import VenueForm from "@/components/Venues/VenueForm";
import { toast } from "react-toastify";

export default function Create() {
    const { merchant, facilities, venue_categories } = usePage().props;

    const { data, setData, post, transform, processing, errors } = useForm({
        name: "",
        description: "",
        phone_number: "",
        category_ids: [],
        facility_ids: [],
        images: [],
        main_image_index: 0,

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
        transform((oldData) => ({
            ...oldData,
            images: oldData.images.map((img) => img.file),
            main_image_index: parseInt(oldData.main_image_index),
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.venues.store"), {
            forceFormData: true,
            onSuccess: () => toast.success("Venue berhasil ditambahkan"),
            onError: (err) => {
                toast.error(
                    "Mohon periksa kembali formulir tambah venue olahraga.",
                );
            },
        });
    };

    return (
        <MerchantLayout>
            <Head title={`Tambah Venue - ${merchant?.name || "Mitra"}`} />
            <VenueForm
                data={data}
                setData={setData}
                merchant={merchant}
                facilities={facilities}
                venue_categories={venue_categories}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Tambah Venue"
                mode="create"
            />
        </MerchantLayout>
    );
}
