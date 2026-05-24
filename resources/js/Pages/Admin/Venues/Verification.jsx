import React, { useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import ConfirmModal from "@/components/Common/ConfirmModal";
import MerchantProfileAccountSummary from "@/features/merchants/components/summaries/MerchantProfileAccountSummary";
import MerchantProfileBusinessSummary from "@/features/merchants/components/summaries/MerchantProfileBusinessSummary";
import MerchantOwnerSummary from "@/features/merchants/components/summaries/MerchantOwnerSummary";
import MerchantPayoutMethodSummary from "@/features/merchants/components/summaries/MerchantPayoutMethodSummary";
import LabelInput from "@/components/Common/LabelInput";
import TextArea from "@/components/Common/TextArea";
import ErrorInput from "@/components/Common/ErrorInput";
import { ArrowLeft } from "lucide-react";
import { formatFullDateTime } from "@/utils/date";
import BannerAlert from "@/components/Common/BannerAlert";
import VenueSummary from "@/features/venues/components/summaries/VenueSummary";
import VenuePaymentPolicySummary from "@/features/venues/components/summaries/VenuePaymentPolicySummary";
import VenueMembershipPackageSummary from "@/features/venues/components/summaries/VenueMembershipPackageSummary";
import VenueCourtSummary from "@/features/venues/components/summaries/VenueCourtSummary";

export default function Verification() {
    const {
        auth,
        venue: { data: venue },
    } = usePage().props;

    const admin = auth.admin;

    if (!venue) return null;

    const approvedHistory = venue?.status_histories?.find(
        (h) => h.status?.toLowerCase() === "approved",
    );

    const approvalDate = approvedHistory?.created_at;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, patch, processing, reset, errors, setError } =
        useForm({
            status: "",
            reason: "",
        });

    const handleAction = (status, reason) => {
        router.patch(
            route(
                "admin.venues.verification.updateVenueVerification",
                venue.slug,
            ),
            {
                status: status,
                reason: reason,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(
                        status === "approved"
                            ? "Verifikasi disetujui!"
                            : "Verifikasi ditolak!",
                    );
                    reset();
                },
                onError: (err) => {
                    console.error("Error validasi:", err);
                    toast.error("Gagal verifikasi. Periksa kembali input.");
                },
            },
        );
    };

    return (
        <AdminLayout>
            <Head title={`Verifikasi Data Venue ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-2 md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row md:gap-2 font-bold text-2xl items-center ">
                                <span>Verifikasi Data Venue</span>

                                <span className="text-primary-600 dark:text-primary-500">
                                    {venue.name}
                                </span>
                            </div>
                            <div className="text-xs text-secondary-600 dark:text-secondary-400">
                                <div>
                                    <span>Venue Ditambahkan: </span>
                                    <span className="font-semibold">
                                        {formatFullDateTime(venue.created_at)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold">
                                        Verifikasi Data Venue:{" "}
                                    </span>
                                    <span className="font-semibold">
                                        {approvalDate
                                            ? formatFullDateTime(approvalDate)
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <div className="my-4 mx-8 flex flex-col gap-6">
                        {venue?.status === "rejected" &&
                            venue?.latest_status?.reason && (
                                <BannerAlert
                                    type="error"
                                    title=" Keterangan Penolakan Verifikasi Data Venue"
                                    size="xs"
                                    className="my-0"
                                >
                                    <div className="space-x-2">
                                        <span>
                                            {venue.latest_status?.reason}
                                        </span>
                                        <span className="opacity-90 font-medium">
                                            (
                                            {formatFullDateTime(
                                                venue.latest_status?.created_at,
                                            )}
                                            )
                                        </span>
                                    </div>
                                </BannerAlert>
                            )}
                        <MerchantProfileAccountSummary
                            admin={admin}
                            merchant={venue.merchant}
                        />

                        <VenueSummary
                            venue={venue}
                            merchant={venue.merchant}
                            categories={venue.venue_categories ?? []}
                            social_media={venue.social_media}
                        />
                        <div className="flex flex-col md:flex-row gap-6">
                            <VenuePaymentPolicySummary
                                venue={venue}
                                merchant={venue.merchant}
                            />
                            <VenueMembershipPackageSummary
                                venue={venue}
                                merchant={venue.merchant}
                            />
                        </div>
                        <VenueCourtSummary
                            venue={venue}
                            merchant={venue.merchant}
                        />
                    </div>
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() => router.get(route("admin.venues.index"))}
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                    {venue.status === "pending" && (
                        <Button
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Verifikasi
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <ConfirmModal
                show={isModalOpen}
                title={`Verifikasi Data Venue ${venue?.name} - Mitra ${venue?.merchant?.name}`}
                description={`Apakah Anda ingin menyetujui atau menolak data dari ${venue?.name}?`}
                confirmText="Setujui"
                requireReason={true}
                rejectText="Tolak Data"
                onConfirm={({ reason }) => handleAction("approved", reason)}
                onReject={({ reason }) => handleAction("rejected", reason)}
                validateReject={(reason) => reason.trim().length < 10}
                rejectHint="* Tuliskan alasan penolakan minimal 10 karakter."
                onClose={() => setIsModalOpen(false)}
                isProcessing={loading}
            />
        </AdminLayout>
    );
}
