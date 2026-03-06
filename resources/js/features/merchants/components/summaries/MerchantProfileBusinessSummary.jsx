import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import { ShieldCheck, EyeOff, Eye, Copy, User } from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import Badge from "@/components/Common/Badge";
import { getProfileVerificationStatus } from "@/utils/attributes/merchantAttribute";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatTo08 } from "@/utils/numberPhone";
import { formatBusinessType } from "@/utils/businessType";
import { formatFullAddress } from "@/utils/address";
import { router } from "@inertiajs/react";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { formatFullDateTime } from "@/utils/date";

export default function MerchantProfileBusinessSummary({ merchant }) {
    const profile = merchant?.profile;
    const latestStatus = profile?.latest_status;

    const statusProfile = getProfileVerificationStatus(
        profile?.status,
        latestStatus?.created_at,
        latestStatus,
    );
    const StatusIcon = statusProfile.icon;

    const shouldShowReason = latestStatus && !latestStatus.is_system_generated;

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatNIBNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `${number.substring(0, 4)}*********${number.slice(-4)}`;
    };

    const handleAction = (status, reason) => {
        if (loading) return;

        router.patch(
            route(
                "admin.merchants.verification.updateMerchantProfileVerification",
                merchant.slug,
            ),
            { status, reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success("Status berhasil diperbarui");
                },
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    const actionDisplay = (
        <div className="flex flex-row gap-2 items-center">
            {profile?.status === "pending" && (
                <Button
                    variant="primary"
                    size="xs"
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] py-1 px-2 rounded-md"
                >
                    Verifikasi!
                </Button>
            )}
            <div>
                <Badge
                    color={statusProfile.color}
                    tooltip={statusProfile.timestamp || ""}
                    className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap "
                >
                    <StatusIcon
                        size={14}
                        className={
                            profile?.status === "rejected"
                                ? "animate-pulse"
                                : ""
                        }
                    />
                    <span
                        className={
                            profile?.status === "rejected"
                                ? "animate-pulse"
                                : ""
                        }
                    >
                        {statusProfile.label}
                    </span>
                </Badge>
            </div>
        </div>
    );

    return (
        <ContentCard
            variant="elevated"
            icon={User}
            title="Profil Bisnis"
            action={actionDisplay}
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            {profile?.status === "pending" && shouldShowReason && (
                <BannerAlert
                    type="info"
                    showIcon={false}
                    title="Catatan Mitra:"
                    size="xs"
                    className="my-0 "
                >
                    <div className="space-x-2">
                        <span>{latestStatus?.reason}</span>
                        <span className="opacity-90 font-medium">
                            ({formatFullDateTime(latestStatus?.created_at)})
                        </span>
                    </div>
                </BannerAlert>
            )}
            {profile?.status === "approved" && statusProfile.changeByName && (
                <div className="flex justify-end">
                    <Badge color={statusProfile.color}>
                        Direview oleh: {statusProfile.changeByName || "System"}
                    </Badge>
                </div>
            )}
            {profile?.status === "rejected" && latestStatus?.reason && (
                <BannerAlert
                    type="error"
                    title={
                        <span>
                            Disetujui oleh:{" "}
                            {profile?.latest_status?.change_by_snapshot}
                        </span>
                    }
                    size="xs"
                    className="my-0"
                >
                    <div className="space-x-2">
                        <span>{profile?.latest_status?.reason}</span>
                        <span className="opacity-90 font-medium">
                            (
                            {formatFullDateTime(
                                profile?.latest_status?.created_at,
                            )}
                            )
                        </span>
                    </div>
                </BannerAlert>
            )}
            <DescriptionItem label="Nama Perusahaan" className="space-y-0">
                <span className="font-medium text-secondary-900 dark:text-white">
                    {profile?.business_name || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem label="Email Perusahaan" className="space-y-0">
                <span className="font-medium text-secondary-900 dark:text-white">
                    {profile?.business_email || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem
                label="No. Handphone Perusahaan"
                className="space-y-0"
            >
                <span className="font-medium text-secondary-900 dark:text-white">
                    {formatTo08(profile?.business_phone_number) || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem label="Tipe Bisnis" className="space-y-0">
                <span className="font-medium text-secondary-900 dark:text-white uppercase">
                    {formatBusinessType(profile?.business_type) || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem label="NIB " className="space-y-1">
                <div className="flex gap-2 justify-between items-center bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                    <div className="flex gap-2 items-center ">
                        <span className="font-mono font-bold text-sm tracking-wider">
                            {formatNIBNumber(profile?.nib)}
                        </span>
                        {profile?.nib && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setIsVisible(!isVisible)}
                                    tooltip={
                                        isVisible ? "Sembunyikan" : "Tampilkan"
                                    }
                                >
                                    {isVisible ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        if (profile?.nib) {
                                            navigator.clipboard.writeText(
                                                profile.nib,
                                            );
                                            toast.success(
                                                "NIB berhasil disalin ke clipboard",
                                                {
                                                    position: "bottom-center",
                                                    autoClose: 3000,
                                                    hideProgressBar: true,
                                                    theme: "colored",
                                                },
                                            );
                                        }
                                    }}
                                    tooltip="Salin NIB"
                                >
                                    <Copy size={14} />
                                </Button>
                            </div>
                        )}
                    </div>
                    <Tippy content="Privasi terjamin. Data Bisnis hanya digunakan untuk keperluan verifikasi internal.">
                        <ShieldCheck
                            className={`w-5 h-5 ${
                                profile?.nib
                                    ? "text-green-500"
                                    : "text-secondary-400"
                            }`}
                        />
                    </Tippy>
                </div>
            </DescriptionItem>
            <DescriptionItem label="Alamat Perusahaan" className="space-y-1">
                <div className="flex gap-2 items-center ">
                    <span className="text-xs">
                        {formatFullAddress(profile?.address?.full_address) ||
                            "-"}
                    </span>
                    {profile?.address?.full_address && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                copyToClipboard(
                                    profile.address?.full_address,
                                    "Alamat",
                                )
                            }
                            tooltip="Salin Alamat"
                        >
                            <Copy size={14} />
                        </Button>
                    )}
                </div>
            </DescriptionItem>
            <ConfirmModal
                show={isModalOpen}
                title="Verifikasi Profil Bisnis Mitra"
                description={`Apakah Anda ingin menyetujui atau menolak data dari ${profile?.business_name}?`}
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
        </ContentCard>
    );
}
