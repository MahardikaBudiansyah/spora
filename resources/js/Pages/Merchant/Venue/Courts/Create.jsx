import { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import CourtForm from "@/Pages/Merchant/Venue/Courts/Partials/CourtForm";
import { toast } from "react-toastify";

export default function Create() {
    const { venue, surfaces, court_categories, timeSlots } = usePage().props;

    const { data, setData, post, transform, processing, errors } = useForm({
        name: "",
        venue_id: venue?.id ?? null,
        description: "",
        court_surface_id: "",
        categories: [],
        images: [],
        main_image_index: 0,

        timeSlots: {
            weekday: [],
            weekend: [],
            holiday: [],
        },
        prices: {
            weekday: {},
            weekend: {},
            holiday: {},
        },
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

        post(route("merchant.venues.courts.store", { venue: venue.slug }), {
            forceFormData: true,

            onSuccess: () => toast.success("Lapangan berhasil ditambahkan"),
            onError: (err) => {
                toast.error("Gagal menambahkan lapangan");
                console.error(err);
            },
        });
    };

    return (
        <MerchantLayout>
            <Head title={`Tambah Lapangan - ${venue?.name || "Venue"}`} />
            <CourtForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                mode="create"
                title="Tambah Lapangan"
                venue={venue}
                surfaces={surfaces}
                court_categories={court_categories}
                timeSlots={timeSlots}
            />
        </MerchantLayout>
    );
}
