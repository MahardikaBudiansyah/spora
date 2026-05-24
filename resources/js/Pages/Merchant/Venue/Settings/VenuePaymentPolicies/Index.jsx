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
    const {
        venue: { data: venue },
    } = usePage().props;

    console.log(venue);

    const { isOpen, open, close } = useModal();

    const bookingPolicy = venue.payment_policies?.find(
        (p) => p.order_type === "booking",
    );

    const { data, setData, post, processing, errors } = useForm({
        venue_id: venue.id,
        enable_dp: bookingPolicy?.enable_dp ?? false,
        dp_type: bookingPolicy?.dp_type ?? "fixed",
        dp_value: bookingPolicy?.dp_value ?? 0,
        full_payment_days_before: bookingPolicy?.full_payment_days_before ?? 1,
        max_full_payment_days: bookingPolicy?.max_full_payment_days ?? 3,
        enable_refund: bookingPolicy?.enable_refund ?? false,
        refund_percentage: bookingPolicy?.refund_percentage ?? 0,
    });

    const handleUpdateVenue = (field, value) => {
        if (field === "enable_dp" && value === false) {
            setData((prev) => ({
                ...prev,
                [field]: value,
                dp_value: 0,
            }));
            return;
        }

        if (field === "enable_refund" && value === true) {
            open("RefundDevelopmentModal");
            setData(field, false);
            return;
        }

        setData(field, value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(
            route("merchant.venues.settings.payment-policy.update", {
                venue: venue.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Berhasil disimpan!"),
                onError: (err) => {
                    console.error(err);
                    toast.error("Gagal menyimpan, cek kembali inputan anda.");
                },
            },
        );
    };

    return (
        <MerchantLayout>
            <Head title={`Pengaturan Pembayaran - ${venue.name}`} />
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
                            <div className="text-sm text-secondary-500 dark:text-secondary-400 font-semibold">
                                <span>Venue </span>
                                <span>{venue.name}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-4 pb-8">
                    <div className="m-4">
                        <BannerAlert
                            type="info"
                            showIcon={false}
                            size="xs"
                            title="Informasi Kebijakan Order"
                        >
                            <span>
                                Alur Pembayaran di Muka (DP) dan Refund
                                (Pengembalian Dana) hanya digunakan pada Order
                                Booking saja.
                            </span>
                        </BannerAlert>
                        <form onSubmit={(e) => submit(e)} className="mt-4">
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
                                                open("PrintModal");
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
                                            disabled={processing}
                                            variant="primary"
                                            size="xs"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </Button>
                                    </div>
                                }
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <PaymentFlowPolicy
                                        venue={data}
                                        handleUpdateVenue={handleUpdateVenue}
                                        errors={errors}
                                    />
                                    <RefundPolicy
                                        venue={data}
                                        handleUpdateVenue={handleUpdateVenue}
                                        errors={errors}
                                    />
                                </div>
                            </ContentCard>
                        </form>
                    </div>
                </CardBody>
            </Card>
            <DevelopmentPlaceholder
                title={`Cetak Pengaturan Pembayaran ${venue?.name}`}
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
