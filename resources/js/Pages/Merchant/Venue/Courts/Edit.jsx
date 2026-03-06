import { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import CourtForm from "@/Pages/Merchant/Venue/Courts/Partials/CourtForm";
import { mapTimeSlotInitialData } from "@/utils/courtMapper";
import { mapImagesForEdit, getFeaturedImageIndex } from "@/utils/imageMapper";
import { toast } from "react-toastify";

export default function Edit() {
    const {
        venue,
        court: { data: courtData },
        surfaces,
        court_categories,
        timeSlots = [],
    } = usePage().props;

    const weekday = mapTimeSlotInitialData(courtData.timeSlots, "weekday");
    const weekend = mapTimeSlotInitialData(courtData.timeSlots, "weekend");
    const holiday = mapTimeSlotInitialData(courtData.timeSlots, "holiday");

    const { data, setData, post, transform, processing, errors } = useForm({
        _method: "PUT",

        name: courtData.name ?? "",
        description: courtData.description ?? "",
        venue_id: venue.id,
        court_surface_id: courtData.court_surface_id ?? "",
        categories: courtData.categories ?? [],
        images: mapImagesForEdit(courtData.images),
        main_image_index: getFeaturedImageIndex(courtData.images),
        timeSlots: {
            weekday: weekday.ids,
            weekend: weekend.ids,
            holiday: holiday.ids,
        },
        prices: {
            weekday: weekday.prices,
            weekend: weekend.prices,
            holiday: holiday.prices,
        },
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

        post(
            route("merchant.venues.courts.update", [
                venue.slug,
                courtData.slug,
            ]),
            {
                forceFormData: true,

                onSuccess: () => toast.success("Lapangan berhasil diperbarui"),
                onError: (err) => {
                    toast.error("Mohon periksa kembali formulit input.");
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title={`Edit Lapangan - ${courtData?.name}`} />
            <CourtForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Edit Lapangan"
                mode="edit"
                venue={venue}
                court={courtData}
                surfaces={surfaces}
                court_categories={court_categories}
                timeSlots={timeSlots}
            />
        </MerchantLayout>
    );
}
