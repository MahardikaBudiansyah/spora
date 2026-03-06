import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import { Copy, Building2, ShieldCheck, EyeOff, Eye } from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatTo08 } from "@/utils/numberPhone";
import { toast } from "react-toastify";
import logoDefault from "@/assets/logo/logo-1.png";
import { formatFullAddress } from "@/utils/address";
import Tippy from "@tippyjs/react";
import { formatBusinessType } from "@/utils/businessType";

export default function PlatformProfileInfo({
    admin,
    platform_profile,
    onEdit,
}) {
    const [isVisible, setIsVisible] = useState(false);
    const role = admin?.role;

    const formatNIBNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `${number.substring(0, 4)}*********${number.slice(-4)}`;
    };

    const getButtonLabel = () => {
        if (!platform_profile) return "Lengkapi Data";

        const fields = [
            platform_profile.business_name,
            platform_profile.business_email,
            platform_profile.business_phone_number,
            platform_profile.business_address,
        ];

        const isAllFilled = fields.every((field) => !!field);

        return isAllFilled ? "Edit" : "Lengkapi Data";
    };

    const actionDisplay = (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit()}
                className="text-primary-600 font-semibold px-2 py-1.5"
            >
                {getButtonLabel()}
            </Button>
        </div>
    );

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} berhasil disalin`, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
        });
    };

    return (
        <ContentCard
            variant="soft"
            icon={Building2}
            title={
                role === "superadmin" ? "Profil Bisnis" : "Profil Perusahaan"
            }
            action={role === "superadmin" ? actionDisplay : ""}
            bodyClassName="flex-1 space-y-4"
        >
            <DescriptionItem label="Logo (Official)" className="space-y-0">
                <img
                    src={
                        platform_profile?.logo_path
                            ? `/storage/${platform_profile.logo_path}`
                            : logoDefault
                    }
                    alt={platform_profile?.name || "Logo (Official)"}
                    className="w-40 bg-white"
                />
            </DescriptionItem>

            <DescriptionItem
                label="Nama Perusahaan (Official)"
                className="space-y-0"
            >
                <span className="font-medium text-secondary-900 dark:text-white">
                    {platform_profile?.business_name || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem label="Email (Official)" className="space-y-0">
                <div className="flex gap-2 items-center ">
                    <span className="font-medium text-secondary-900 dark:text-white truncate">
                        {platform_profile?.business_email || "-"}
                    </span>
                    {platform_profile?.business_email && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                copyToClipboard(
                                    platform_profile.business_email,
                                    "Email Official",
                                )
                            }
                            tooltip="Salin Email Official"
                        >
                            <Copy size={14} />
                        </Button>
                    )}
                </div>
            </DescriptionItem>
            <DescriptionItem
                label="No. Handphone (Official)"
                className="space-y-0"
            >
                <div className="flex gap-2 items-center ">
                    <span className="font-medium text-secondary-900 dark:text-white truncate">
                        {formatTo08(platform_profile?.business_phone_number) ||
                            "-"}
                    </span>
                    {platform_profile?.business_phone_number && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                copyToClipboard(
                                    platform_profile.business_phone_number,
                                    "No. Handphone Official",
                                )
                            }
                            tooltip="Salin No. Handphone Official"
                        >
                            <Copy size={14} />
                        </Button>
                    )}
                </div>
            </DescriptionItem>
            <DescriptionItem label="Tipe Bisnis" className="space-y-0">
                <span className="font-medium text-secondary-900 dark:text-white uppercase">
                    {formatBusinessType(platform_profile?.business_type) || "-"}
                </span>
            </DescriptionItem>
            <DescriptionItem label="NIB " className="space-y-1">
                <div className="flex gap-2 justify-between items-center bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                    <div className="flex gap-2 items-center ">
                        <span className="font-mono font-bold text-sm tracking-wider">
                            {formatNIBNumber(platform_profile?.nib)}
                        </span>
                        {platform_profile?.nib && (
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
                                    onClick={() =>
                                        copyToClipboard(
                                            platform_profile.nib,
                                            "Salin NIB",
                                        )
                                    }
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
                                platform_profile?.nib
                                    ? "text-green-500"
                                    : "text-secondary-400"
                            }`}
                        />
                    </Tippy>
                </div>
            </DescriptionItem>
            <DescriptionItem
                label={
                    role === "superadmin"
                        ? "Alamat Kantor (Official)"
                        : "Alamat Perusahaan"
                }
                className="space-y-1"
            >
                <div className="flex gap-2 items-center ">
                    <span className="text-xs">
                        {formatFullAddress(
                            platform_profile?.address?.full_address,
                        ) || "-"}
                    </span>
                    {platform_profile?.address?.full_address && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                copyToClipboard(
                                    platform_profile.address?.full_address,
                                    "Alamat Kantor (Official)",
                                )
                            }
                            tooltip="Salin Alamat Kantor (Official)"
                        >
                            <Copy size={14} />
                        </Button>
                    )}
                </div>
            </DescriptionItem>
            {role === "superadmin" && (
                <DescriptionItem
                    label="Midtrans Sub-Account ID"
                    className="space-y-0"
                >
                    <div className="flex gap-2 items-center ">
                        <span className="font-medium text-secondary-900 dark:text-white truncate">
                            {platform_profile?.midtrans_sub_account_id || "-"}
                        </span>
                        {platform_profile?.midtrans_sub_account_id && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    copyToClipboard(
                                        platform_profile.midtrans_sub_account_id,
                                        "ID Midtrans",
                                    )
                                }
                                tooltip="Salin ID Midtrans"
                            >
                                <Copy size={14} />
                            </Button>
                        )}
                    </div>
                </DescriptionItem>
            )}
            {role === "superadmin" && (
                <DescriptionItem
                    label="Xendit Sub-Account ID"
                    className="space-y-0"
                >
                    <div className="flex gap-2 items-center ">
                        <span className="font-medium text-secondary-900 dark:text-white truncate">
                            {platform_profile?.xendit_sub_account_id || "-"}
                        </span>
                        {platform_profile?.xendit_sub_account_id && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    copyToClipboard(
                                        platform_profile.xendit_sub_account_id,
                                        "ID Xendit",
                                    )
                                }
                                tooltip="Salin ID Xendit"
                            >
                                <Copy size={14} />
                            </Button>
                        )}
                    </div>
                </DescriptionItem>
            )}
        </ContentCard>
    );
}
