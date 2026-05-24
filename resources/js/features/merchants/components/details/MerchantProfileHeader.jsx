import { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardBody } from "@/components/common/Card";
import BannerSection from "@/components/common/BannerSection";
import { Edit, KeyRound, Mail, Store } from "lucide-react";
import Badge from "@/components/Common/Badge";
import {
    getEmailVerificationStatus,
    getMerchantStatus,
    getOverallProgress,
    getPhoneNumberVerificationStatus,
} from "@/utils/attributes/merchantAttribute";
import ProfileAvatar from "@/components/Common/ProfileAvatar";
import { toast } from "react-toastify";
import ProgressBar from "@/components/Common/ProgressBar";
import Button from "@/components/Common/Button";
import { RiWhatsappFill } from "react-icons/ri";
import { formatTo08 } from "@/utils/numberPhone";
import KebabDropdown from "@/components/dropdown/KebabDropdown";
import BannerAlert from "@/components/Common/BannerAlert";

export default function MerchantProfileHeader({ merchant, onEdit, onDelete }) {
    const statusMerchant = getMerchantStatus(
        merchant?.status,
        merchant?.latest_status?.created_at,
        null,
        merchant?.latest_submission_at,
        merchant?.is_reverification_required,
    );
    const StatusIcon = statusMerchant.icon;

    const statusEmailMerchant = getEmailVerificationStatus(
        merchant?.email_verified_at,
    );
    const StatusEmailIcon = statusEmailMerchant.icon;

    const statusPhoneNumberMerchant = getPhoneNumberVerificationStatus(
        merchant?.phone_verified_at,
    );
    const StatusPhoneNumberIcon = statusPhoneNumberMerchant.icon;

    const [isLoading, setIsLoading] = useState(false);

    const handleLogoChange = (selected) => {
        const value = selected.value;

        if (!value) return;

        router.post(
            route("merchant.profile.update.logo"),
            {
                _method: "put",
                logo_path: value,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onBefore: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: () => {
                    toast.success("Logo berhasil diperbarui");
                },
                onError: (err) =>
                    toast.error(err.logo_path || "Gagal memperbarui Logo"),
            },
        );
    };

    const progress = getOverallProgress(merchant);
    const getProgressVariant = (percent) => {
        if (percent <= 25) return "red";
        if (percent <= 50) return "orange";
        if (percent < 100) return "cyan";
        return "green";
    };

    const progressColor = getProgressVariant(progress);

    const menuItems = [
        {
            label: "Edit Akun",
            onClick: () => onEdit("account"),
            icon: Edit,
            as: "button",
        },
        {
            label: "Ubah Password",
            onClick: () => onEdit("security"),
            icon: KeyRound,
            as: "button",
        },
        {
            label: "Hapus Akun",
            onClick: () => onDelete(),
            icon: Store,
            as: "button",
        },
    ];

    return (
        <div className="relative">
            <BannerSection
                className="rounded-lg md:rounded-xl h-48"
                overlayClass="bg-black/20 rounded-lg md:rounded-xl"
            />
            <div className="flex flex-col md:flex-row gap-6 relative z-10 -mt-24 md:-mt-16 px-4 md:px-8">
                <Card className="w-full shadow-sm">
                    <CardBody className="p-5 flex flex-row justify-center md:justify-between">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                            <ProfileAvatar
                                src={merchant?.logo_path}
                                user={{
                                    name: merchant?.name,
                                }}
                                size="3xl"
                                onChange={handleLogoChange}
                                isLoading={isLoading}
                                className="shadow-none shrink-0 bg"
                            />
                            <div className="flex-1 space-y-1 text-center md:text-left mb-2 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 mb-2">
                                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white leading-tight">
                                        {merchant?.name}
                                    </h2>
                                    <div className="flex justify-center md:justify-start gap-2">
                                        <Badge
                                            color={statusMerchant.color}
                                            tooltip={
                                                statusMerchant.timestamp || ""
                                            }
                                            className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap"
                                        >
                                            <StatusIcon
                                                size={14}
                                                className={
                                                    merchant?.status ===
                                                    "rejected"
                                                        ? "animate-pulse"
                                                        : ""
                                                }
                                            />
                                            <span
                                                className={
                                                    merchant?.status ===
                                                    "rejected"
                                                        ? "animate-pulse"
                                                        : ""
                                                }
                                            >
                                                {statusMerchant.label}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-500 dark:text-stone-400">
                                    <Store size={16} />
                                    <span className="text-sm font-medium">
                                        Mitra Spora
                                    </span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-500 dark:text-stone-400">
                                    <Mail size={16} />
                                    <span className="text-sm font-medium">
                                        {merchant.email}
                                    </span>
                                    <Badge
                                        color={statusEmailMerchant.color}
                                        tooltip={
                                            statusEmailMerchant.timestamp || ""
                                        }
                                        className="flex items-center gap-1 px-2 py-0.5 font-bold whitespace-nowrap "
                                    >
                                        <StatusEmailIcon
                                            size={14}
                                            className={
                                                !statusEmailMerchant.isVerified
                                                    ? "animate-pulse"
                                                    : ""
                                            }
                                        />
                                        {statusEmailMerchant.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-500 dark:text-stone-400">
                                    <RiWhatsappFill size={16} />
                                    <span className="text-sm font-medium">
                                        {formatTo08(merchant.phone_number)}
                                    </span>
                                    <Badge
                                        color={statusEmailMerchant.color}
                                        tooltip={
                                            statusEmailMerchant.timestamp || ""
                                        }
                                        className="flex items-center gap-1 px-2 py-0.5 font-bold whitespace-nowrap "
                                    >
                                        <StatusPhoneNumberIcon
                                            size={14}
                                            className={
                                                !statusEmailMerchant.isVerified
                                                    ? "animate-pulse"
                                                    : ""
                                            }
                                        />
                                        {statusEmailMerchant.label}
                                    </Badge>
                                </div>
                                <div className="pt-4 max-w-lg">
                                    {progress && (
                                        <>
                                            <ProgressBar
                                                value={progress}
                                                color={progressColor}
                                                size="sm"
                                                showLabel={true}
                                            />
                                            {progress < 100 && (
                                                <p className="text-xs text-secondary-500 dark:text-secondary-200 mt-1">
                                                    Selesaikan Data Akun Mitra,
                                                    Data Owner Mitra, Data
                                                    Pencairan Dana Mitra untuk
                                                    memulai fitur yang lengkap.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-5 lg:static flex flex-row gap-2 items-center lg:items-start">
                            <KebabDropdown menuItems={menuItems} />
                            <Button
                                variant="light"
                                size="xs"
                                onClick={() => onEdit("account")}
                                tooltip="Edit Akun"
                                className="p-2 hidden lg:block"
                            >
                                <Edit size={14} />
                            </Button>
                            <Button
                                variant="light"
                                size="xs"
                                onClick={() => onEdit("security")}
                                tooltip="Ubah Passowrd"
                                className="p-2 hidden lg:block"
                            >
                                Ubah Password
                            </Button>
                            <Button
                                variant="danger"
                                size="xs"
                                onClick={() => onDelete()}
                                tooltip="Hapus"
                                className="p-2 hidden lg:block"
                            >
                                <Store size={14} />
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
