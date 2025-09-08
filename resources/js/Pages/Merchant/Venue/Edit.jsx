import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import VenueForm from "@/Pages/Merchant/Venue/Partials/VenueForm";
import { toast } from "react-toastify";

export default function Edit({ venue }) {
    const [selectedFacilities, setSelectedFacilities] = useState(
        venue?.facility ?? []
    );

    const [images, setImages] = useState(() =>
        (venue.images ?? [])
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

    const [address, setAddress] = useState({
        province_code: venue.address?.province_code ?? null,
        city_code: venue.address?.city_code ?? null,
        district_code: venue.address?.district_code ?? null,
        village_code: venue.address?.village_code ?? null,
        postal_code: venue.address?.postal_code ?? "",
        full_address: venue.address?.full_address ?? "",
    });

    const { data, setData, processing, errors } = useForm({
        name: venue?.name ?? "",
        description: venue?.description ?? "",
        phone_number: venue?.phone_number ?? "",
        facility: venue?.facility ?? [],
        main_image_index: Math.max(
            (venue.images ?? []).findIndex((img) => img.is_featured),
            0
        ),
    });

    useEffect(() => {
        setData("facility", selectedFacilities);
    }, [selectedFacilities]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("phone_number", data.phone_number);

        // facilities
        selectedFacilities?.forEach((f, i) =>
            formData.append(`facility[${i}]`, f)
        );

        // address
        formData.append("province_code", address.province_code ?? "");
        formData.append("city_code", address.city_code ?? "");
        formData.append("district_code", address.district_code ?? "");
        formData.append("village_code", address.village_code ?? "");
        formData.append("postal_code", address.postal_code ?? "");
        formData.append("full_address", address.full_address ?? "");

        // images baru
        images.forEach((img) => {
            if (img && !img.isExisting && img.file) {
                formData.append("images[]", img.file);
            }
        });

        // existing image ids
        const existingIds = images
            .filter((img) => img.isExisting)
            .map((img) => img.id);
        formData.append("existing_image_ids", JSON.stringify(existingIds));

        // featured image
        formData.append("main_image_index", data.main_image_index);

        const mainImage =
            images.length > data.main_image_index
                ? images[data.main_image_index]
                : null;

        if (mainImage?.isExisting && mainImage?.id) {
            formData.append("main_image_id", mainImage.id);
        }

        formData.append("_method", "PUT");

        router.post(
            route("merchant.venues.update", { venue: venue.slug }),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                headers: { "X-HTTP-Method-Override": "PUT" },
                onSuccess: () => toast.success("Venue berhasil diperbarui!"),
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal memperbarui data venue.");
                    }
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title="Edit Venue" />
            <VenueForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Edit Venue"
                mode="edit"
                selectedFacilities={selectedFacilities}
                setSelectedFacilities={setSelectedFacilities}
                images={images}
                setImages={setImages}
                address={address}
                setAddress={setAddress}
            />
        </MerchantLayout>
    );
}
