import { useState } from "react";
import { router } from "@inertiajs/react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import { ShieldCheck, Info, EyeOff, Eye, Copy, Building2 } from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import Badge from "@/components/Common/Badge";
import { formatTo08 } from "@/utils/numberPhone";
import {
    checkSectionCompletion,
    getProfileVerificationStatus,
    getSectionProgress,
} from "@/utils/attributes/merchantAttribute";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import { formatFullAddress } from "@/utils/address";
import { formatBusinessType } from "@/utils/businessType";
import ProgressBar from "@/components/Common/ProgressBar";
import ConfirmModal from "@/components/Common/ConfirmModal";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatFullDateTime } from "@/utils/date";

export default function MerchantProfileInfo({ merchant, onEdit }) {
    const profile = merchant?.profile;
    const latestStatus = profile?.latest_status;
    const statusProfile = getProfileVerificationStatus(
        profile?.status,
        latestStatus?.created_at,
        latestStatus,
    );

    const StatusIcon = statusProfile.icon;

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatNIBNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `${number.substring(0, 4)}*********${number.slice(-4)}`;
    };

    const getButtonLabel = () => {
        if (!profile) return "Lengkapi Data";

        const fields = [
            profile.business_name,
            profile.business_email,
            profile.business_phone_number,
            profile.business_type,
            profile.nib,
            profile.address,
        ];

        const isAllFilled = fields.every((field) => !!field);

        return isAllFilled ? "Edit" : "Lengkapi Data";
    };

    const isProfileComplete = checkSectionCompletion(merchant, "profile");
    const progress = getSectionProgress(merchant, "profile");
    const getProgressColor = (value) => {
        if (value <= 25) return "red";
        if (value <= 50) return "orange";
        if (value <= 75) return "cyan";
        return "green";
    };

    const actionDisplay = (
        <Button
            variant="ghost"
            size="xs"
            onClick={() => onEdit()}
            disabled={profile?.status === "pending"}
            className="text-primary-600 font-semibold"
        >
            {getButtonLabel()}
        </Button>
    );

    const handleProfileVerification = (reason) => {
        if (loading) return;

        router.patch(
            route("merchant.profile.verification.requestVerification"),
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(
                        "Proses Pengajuan Profil Bisnis Mitra Berhasil",
                    );
                },
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
                onError: (errors) => {
                    console.error("Error dari server:", errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        const firstError = Object.values(errors)[0];
                        toast.error(
                            firstError || "Terjadi kesalahan saat verifikasi.",
                        );
                    }
                },
            },
        );
    };

    return (
        <ContentCard
            variant="soft"
            title="Profil Bisnis"
            icon={Building2}
            action={actionDisplay}
            bodyClassName="flex-1 space-y-4"
        >
            {profile?.status === "rejected" &&
                profile?.latest_status?.reason && (
                    <BannerAlert
                        type="error"
                        title={
                            <span>
                                Direview oleh:{" "}
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
            {!isProfileComplete ? (
                <ProgressBar
                    value={progress}
                    color={getProgressColor(progress)}
                    size="sm"
                    showLabel={true}
                    labelSuffix="Data Profil Bisnis Lengkap"
                />
            ) : (
                <>
                    {profile?.status === "draft" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-green-600">
                                <Tippy content="Privasi terjamin. Data Profil Bisnis Mitra hanya digunakan untuk keperluan verifikasi internal.">
                                    <ShieldCheck size={16} />
                                </Tippy>
                                <span className="text-xs font-bold">
                                    Data Profil Bisnis Lengkap
                                </span>
                            </div>
                            <div>
                                <Button
                                    variant="primary"
                                    size="xs"
                                    onClick={() => setIsModalOpen(true)}
                                    className="py-1 px-3 text-xs rounded-md"
                                >
                                    Ajukan Verifikasi Sekarang
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="flex justify-between items-center">
                <DescriptionItem label="Nama Perusahaan" className="space-y-0">
                    <span className="font-medium text-secondary-900 dark:text-white">
                        {profile?.business_name || "-"}
                    </span>
                </DescriptionItem>
                {profile?.business_name && (
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
                )}
            </div>
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
                    <Tippy content="Privasi terjamin. Data NIB hanya digunakan untuk keperluan verifikasi internal.">
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
                title="Pengajuan Data Profil Bisnis Mitra"
                description={`Apakah Anda ingin yakin pengajuan data  Profil Bisnis ${profile?.business_name}?`}
                confirmText="Setujui"
                requireReason={true}
                reasonPlaceholder="Tambah catatan pengajuan verifikasi di sini (opsional)..."
                onConfirm={({ reason }) => handleProfileVerification(reason)}
                onClose={() => setIsModalOpen(false)}
                isProcessing={loading}
            />
        </ContentCard>
    );
}
