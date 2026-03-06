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

export default function Verification() {
    const {
        auth,
        merchant: { data: merchant },
    } = usePage().props;

    const admin = auth.admin;

    console.log("Data Merchant: ", merchant);

    if (!merchant) return null;

    const approvedHistory = merchant?.status_histories?.find(
        (h) => h.status?.toLowerCase() === "approved",
    );

    const approvalDate = approvedHistory?.created_at;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, patch, processing, reset, errors, setError } =
        useForm({
            status: "",
            reason: "",
            reason_merchant_owner: "",
            reason_merchant_profile: "",
            reason_merchant_payout_method: "",
        });

    const handleAction = (status) => {
        router.patch(
            route(
                "admin.merchants.verification.updateAllVerification",
                merchant.slug,
            ),
            {
                ...data,
                status: status,
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
            <Head title={`Verifikasi Data Mitra ${merchant.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-2 md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row md:gap-2 font-bold text-2xl items-center ">
                                <span>Verifikasi Data Mitra</span>

                                <span className="text-primary-600 dark:text-primary-500">
                                    {merchant.name}
                                </span>
                            </div>
                            <div className="text-xs text-secondary-600 dark:text-secondary-400">
                                <div>
                                    <span>Pendaftaran Akun: </span>
                                    <span className="font-semibold">
                                        {formatFullDateTime(
                                            merchant.created_at,
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold">
                                        Verifikasi Data Mitra:{" "}
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
                        {merchant?.status === "rejected" &&
                            merchant?.latest_status?.reason && (
                                <BannerAlert
                                    type="error"
                                    title=" Keterangan Penolakan Verifikasi Data Mitra"
                                    size="xs"
                                    className="my-0"
                                >
                                    <div className="space-x-2">
                                        <span>
                                            {merchant.latest_status?.reason}
                                        </span>
                                        <span className="opacity-90 font-medium">
                                            (
                                            {formatFullDateTime(
                                                merchant.latest_status
                                                    ?.created_at,
                                            )}
                                            )
                                        </span>
                                    </div>
                                </BannerAlert>
                            )}
                        <MerchantProfileAccountSummary
                            admin={admin}
                            merchant={merchant}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <MerchantOwnerSummary merchant={merchant} />
                            <MerchantProfileBusinessSummary
                                merchant={merchant}
                            />
                            <MerchantPayoutMethodSummary merchant={merchant} />
                        </div>
                        <div className="flex flex-row gap-6"></div>
                    </div>
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(route("admin.merchants.index"))
                        }
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                    {merchant.status === "pending" && (
                        <Button
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            All Verifikasi
                        </Button>
                    )}
                </CardFooter>
            </Card>
            <ConfirmModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Verifikasi Data Mitra ${merchant?.name}`}
                description="Tentukan keputusan verifikasi untuk semua bagian yang masih tertunda (Pending)."
                confirmText="Setujui Semua"
                rejectText="Tolak Data"
                onConfirm={() => handleAction("approved")}
                onReject={() => handleAction("rejected")}
                isProcessing={processing}
                maxWidth="4xl"
            >
                <div className="space-y-4">
                    <BannerAlert
                        type="warning"
                        size="xs"
                        title="Instruksi Catatan"
                        showIcon={false}
                        titleClassName="text-xs"
                        className="text-xs"
                    >
                        Tuliskan alasan penolakan (wajib) atau persetujuan
                        (Opsional) pada catatan bagian tertentu. Minimal 10
                        karakter (huruf) pada alasan penolakan.
                    </BannerAlert>

                    <div className="flex flex-col md:flex-row  gap-4 text-left">
                        {merchant?.owner?.status === "pending" && (
                            <div className="w-full space-y-1">
                                <LabelInput value="Catatan Data Pemilik (Owner)" />
                                <TextArea
                                    rows="2"
                                    value={data.reason_merchant_owner}
                                    onChange={(e) =>
                                        setData(
                                            "reason_merchant_owner",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: KTP Buram..."
                                />
                                <ErrorInput
                                    message={errors.reason_merchant_owner}
                                />
                            </div>
                        )}

                        {merchant?.profile?.status === "pending" && (
                            <div className="w-full space-y-1">
                                <LabelInput value="Catatan Data Bisnis" />
                                <TextArea
                                    rows="2"
                                    value={data.reason_merchant_profile}
                                    onChange={(e) =>
                                        setData(
                                            "reason_merchant_profile",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: NIB tidak terverifikasi..."
                                />
                                <ErrorInput
                                    message={errors.reason_merchant_profile}
                                />
                            </div>
                        )}

                        {merchant?.primary_payout_method?.status ===
                            "pending" && (
                            <div className="w-full space-y-1">
                                <LabelInput value="Catatan Rekening" />
                                <TextArea
                                    rows="2"
                                    value={data.reason_merchant_payout_method}
                                    onChange={(e) =>
                                        setData(
                                            "reason_merchant_payout_method",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Nama di rekening tidak sesuai KTP..."
                                />
                                <ErrorInput
                                    message={
                                        errors.reason_merchant_payout_method
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {merchant?.status === "pending" && (
                        <div className="w-full space-y-2 text-left pt-4 border-t border-secondary-200 dark:border-secondary-500">
                            <LabelInput value="Catatan / Alasan Umum" />
                            <TextArea
                                rows="2"
                                value={data.reason}
                                onChange={(e) =>
                                    setData("reason", e.target.value)
                                }
                                placeholder="Tuliskan pesan ringkasan untuk mitra..."
                            />
                            <ErrorInput message={errors.reason} />
                        </div>
                    )}
                </div>
            </ConfirmModal>
        </AdminLayout>
    );
}
