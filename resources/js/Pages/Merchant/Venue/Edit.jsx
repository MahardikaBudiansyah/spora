import { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import VenueForm from "@/components/Venues/VenueForm";
import { mapImagesForEdit, getFeaturedImageIndex } from "@/utils/imageMapper";
import { toast } from "react-toastify";

export default function Edit() {
    const {
        merchant: { data: merchantData },
        venue: { data: venueData },
        facilities,
        venue_categories,
    } = usePage().props;

    const { data, setData, post, transform, processing, errors } = useForm({
        _method: "PUT",

        name: venueData?.name ?? "",
        description: venueData?.description ?? "",
        phone_number: venueData?.phone_number ?? "",
        category_ids: venueData.category_ids ?? [],
        facility_ids: venueData.facility_ids ?? [],

        images: mapImagesForEdit(venueData.images),
        main_image_index: getFeaturedImageIndex(venueData.images),

        province_code: venueData.address?.province_code ?? null,
        city_code: venueData.address?.city_code ?? null,
        district_code: venueData.address?.district_code ?? null,
        village_code: venueData.address?.village_code ?? null,
        postal_code: venueData.address?.postal_code ?? "",
        full_address: venueData.address?.full_address ?? "",
        latitude: venueData.address?.latitude ?? "",
        longitude: venueData.address?.longitude ?? "",
    });

    useEffect(() => {
        transform((oldData) => ({
            ...oldData,

            images: oldData.images
                .filter((img) => !img.isExisting)
                .map((img) => img.file),

            existing_image_ids: JSON.stringify(
                oldData.images
                    .filter((img) => img.isExisting)
                    .map((img) => img.id)
            ),

            main_image_index: parseInt(oldData.main_image_index),
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.venues.update", venueData.slug), {
            forceFormData: true,

            onSuccess: () => toast.success("Venue berhasil diperbarui"),
            onError: (err) => {
                toast.error("Mohon periksa kembali formulit input.");
            },
        });
    };

    return (
        <MerchantLayout>
            <Head title={`Edit Venue - ${venueData?.name}`} />
            <VenueForm
                merchant={merchantData}
                venue={venueData}
                facilities={facilities}
                venue_categories={venue_categories}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Edit Venue"
                mode="edit"
            />
        </MerchantLayout>
    );
}
