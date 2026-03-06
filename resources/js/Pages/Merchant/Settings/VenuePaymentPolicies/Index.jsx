import { useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import useModal from "@/hooks/useModal";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Tabs from "@/components/Common/Tabs";
import Button from "@/components/Common/Button";
import ContentCard from "@/components/cards/ContentCard";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import { FileText, Save } from "lucide-react";
import PaymentFlowPolicy from "@/features/paymentPolicies/components/PaymentFlowPolicy";
import RefundPolicy from "@/features/paymentPolicies/components/RefundPolicy";
import BannerAlert from "@/components/Common/BannerAlert";

export default function Index() {
    const { merchant, venues: { data: venues = [] } = {} } = usePage().props;
    const { isOpen, open, close } = useModal();

    const [selectedVenue, setSelectedVenue] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, errors } = useForm({
        venue_policies: venues.map((venue) => {
            const bookingPolicy = venue.payment_policies?.find(
                (p) => p.order_type === "booking",
            );

            return {
                venue_id: venue.id,
                name: venue.name,
                enable_dp: bookingPolicy?.enable_dp ?? false,
                dp_type: bookingPolicy?.dp_type ?? "fixed",
                dp_value: bookingPolicy?.dp_value ?? 0,
                full_payment_days_before:
                    bookingPolicy?.full_payment_days_before ?? 1,
                max_full_payment_days:
                    bookingPolicy?.max_full_payment_days ?? 3,
                enable_refund: bookingPolicy?.enable_refund ?? false,
                refund_percentage: bookingPolicy?.refund_percentage ?? 0,
            };
        }),
    });

    // const handleUpdateVenue = (index, field, value) => {
    //     const updatedPolicies = [...data.venue_policies];

    //     if (field === "enable_dp" && value === false) {
    //         updatedPolicies[index]["dp_value"] = 0;
    //     }

    //     updatedPolicies[index][field] = value;
    //     setData("venue_policies", updatedPolicies);
    // };

    const handleUpdateVenue = (index, field, value) => {
        const updatedPolicies = [...data.venue_policies];

        // Logika Reset DP jika dimatikan
        if (field === "enable_dp" && value === false) {
            updatedPolicies[index]["dp_value"] = 0;
        }

        // --- LOGIKA BARU UNTUK REFUND ---
        if (field === "enable_refund" && value === true) {
            // Set info venue yang sedang diedit agar judul modal sesuai (opsional)
            setSelectedVenue(venues[index]);

            // Buka modal placeholder
            open("RefundDevelopmentModal");

            // Paksa value tetap false karena fitur belum siap
            updatedPolicies[index][field] = false;
        } else {
            // Jika field lain atau enable_refund dimatikan, jalankan seperti biasa
            updatedPolicies[index][field] = value;
        }

        setData("venue_policies", updatedPolicies);
    };

    const submit = (e, index) => {
        e.preventDefault();
        setIsProcessing(index);

        const specificVenueData = data.venue_policies[index];

        router.post(
            route("merchant.settings.payment-policy.update"),
            specificVenueData,
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Berhasil disimpan!"),
                onFinish: () => setIsProcessing(null),
                onError: (errors) => {
                    console.error("Validation Errors:", errors);
                    toast.error("Gagal menyimpan, cek kembali inputan anda.");
                },
            },
        );
    };
    return (
        <MerchantLayout>
            <Head title="Pengaturan Pembayaran" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Pengaturan</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Pembayaran
                                </span>
                            </div>
                            <p className="text-sm text-secondary-500">
                                Mitra:{" "}
                                <span className="font-semibold">
                                    {merchant?.name}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-0 pb-8">
                    <div className="m-4">
                        <Tabs
                            defaultActive={0}
                            orientation="horizontal"
                            className="w-full"
                            tabs={data.venue_policies.map((venue, index) => ({
                                id: venue.venue_id,
                                label: venue.name,
                                content: (
                                    <>
                                        <BannerAlert
                                            type="info"
                                            showIcon={false}
                                            size="xs"
                                            title="Informasi Kebijakan Order"
                                        >
                                            <span>
                                                Alur Pembayaran di Muka (DP) dan
                                                Refund hanya digunakan pada
                                                Order Booking saja.
                                            </span>
                                        </BannerAlert>
                                        <form
                                            onSubmit={(e) => submit(e, index)}
                                            className="mt-4"
                                        >
                                            <ContentCard
                                                variant="plain"
                                                title="Konfigurasi Kebijakan"
                                                icon={FileText}
                                                action={
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="xs"
                                                            onClick={() => {
                                                                setSelectedVenue(
                                                                    venues[
                                                                        index
                                                                    ],
                                                                );
                                                                open(
                                                                    "PrintModal",
                                                                );
                                                            }}
                                                        >
                                                            <FileText className="w-4 h-4 mr-1" />{" "}
                                                            Cetak
                                                        </Button>
                                                    </div>
                                                }
                                                footer={
                                                    <div className="flex justify-end w-full">
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                isProcessing ===
                                                                index
                                                            }
                                                            variant="primary"
                                                            size="xs"
                                                        >
                                                            <Save className="w-4 h-4 mr-2" />
                                                            {isProcessing ===
                                                            index
                                                                ? "Menyimpan..."
                                                                : "Simpan"}
                                                        </Button>
                                                    </div>
                                                }
                                            >
                                                <div className="flex flex-col md:flex-row gap-8">
                                                    <PaymentFlowPolicy
                                                        key={venue.id}
                                                        venue={venue}
                                                        index={index}
                                                        handleUpdateVenue={
                                                            handleUpdateVenue
                                                        }
                                                        errors={errors}
                                                    />
                                                    <RefundPolicy
                                                        key={venue.id}
                                                        venue={venue}
                                                        index={index}
                                                        handleUpdateVenue={
                                                            handleUpdateVenue
                                                        }
                                                        errors={errors}
                                                    />
                                                </div>
                                            </ContentCard>
                                        </form>
                                    </>
                                ),
                            }))}
                        />
                    </div>
                </CardBody>
            </Card>
            <DevelopmentPlaceholder
                title={`Cetak Pengaturan Pembayaran ${selectedVenue?.name}`}
                show={isOpen("PrintModal")}
                onClose={close}
            />

            <DevelopmentPlaceholder
                title="Fitur Refund"
                show={isOpen("RefundDevelopmentModal")}
                onClose={close}
            />
        </MerchantLayout>
    );
}
