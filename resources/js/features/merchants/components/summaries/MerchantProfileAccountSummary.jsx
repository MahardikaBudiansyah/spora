import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import Badge from "@/components/Common/Badge";
import Avatar from "@/components/Common/Avatar";
import { Copy, Mail, Store } from "lucide-react";
import { formatTo08 } from "@/utils/numberPhone";
import {
    getMerchantStatus,
    getEmailVerificationStatus,
    getPhoneNumberVerificationStatus,
} from "@/utils/attributes/merchantAttribute";
import Button from "@/components/Common/Button";

export default function MerchantProfileAccountSummary({ admin, merchant }) {
    const isSuperAdmin = admin?.role === "superadmin";

    const statusMerchant = getMerchantStatus(
        merchant?.status,
        merchant?.latest_status?.created_at,
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

    const getInitial = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

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
            variant="elevated"
            icon={Mail}
            title="Profil Akun Mitra"
            action={
                <Badge
                    color={statusMerchant.color}
                    tooltip={statusMerchant.timestamp || ""}
                    className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap"
                >
                    <StatusIcon size={14} className="shrink-0" />
                    {statusMerchant.label}
                </Badge>
            }
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar
                        src={merchant?.logo_path}
                        user={{
                            name: merchant?.name,
                        }}
                        size="xl"
                        fallback={getInitial(merchant?.name)}
                        className="shadow-none shrink-0 bg tracking-wider"
                    />
                    <div className="flex flex-col gap-1 tracking-wider">
                        <span className="text-sm font-bold text-secondary-900 dark:text-white leading-tight whitespace-nowrap">
                            {merchant?.name || "-"}
                        </span>
                        <div className="flex items-center justify-start gap-2 text-primary-600 dark:text-primary-500">
                            <Store size={14} />
                            <span className="text-xs font-medium">
                                Mitra Spora
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DescriptionItem label="Email Resmi" className="space-y-0">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="truncate font-medium">
                                {merchant?.email || "-"}
                            </span>
                            <div>
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
                        </div>
                    </DescriptionItem>
                    <DescriptionItem
                        label="No. Handphone"
                        className="space-y-0"
                    >
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="truncate font-medium">
                                {formatTo08(merchant?.phone_number) || "-"}
                            </span>
                            <div>
                                <Badge
                                    color={statusPhoneNumberMerchant.color}
                                    tooltip={
                                        statusPhoneNumberMerchant.timestamp ||
                                        ""
                                    }
                                    className="flex items-center gap-1 px-2 py-0.5 font-bold whitespace-nowrap "
                                >
                                    <StatusPhoneNumberIcon
                                        size={14}
                                        className={
                                            !statusPhoneNumberMerchant.isVerified
                                                ? "animate-pulse"
                                                : ""
                                        }
                                    />
                                    {statusPhoneNumberMerchant.label}
                                </Badge>
                            </div>
                        </div>
                    </DescriptionItem>
                    {isSuperAdmin && (
                        <DescriptionItem
                            label="Midtrans Sub-Account ID"
                            className="space-y-0"
                        >
                            <div className="flex gap-2 items-center ">
                                <span className="font-medium text-secondary-900 dark:text-white truncate">
                                    {merchant?.midtrans_sub_account_id || "-"}
                                </span>
                                {merchant?.midtrans_sub_account_id && (
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                            copyToClipboard(
                                                merchant.midtrans_sub_account_id,
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
                    {isSuperAdmin && (
                        <DescriptionItem
                            label="Xendit Sub-Account ID"
                            className="space-y-0"
                        >
                            <div className="flex gap-2 items-center ">
                                <span className="font-medium text-secondary-900 dark:text-white truncate">
                                    {merchant?.xendit_sub_account_id || "-"}
                                </span>
                                {merchant?.xendit_sub_account_id && (
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                            copyToClipboard(
                                                merchant.xendit_sub_account_id,
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
                </div>
            </div>
        </ContentCard>
    );
}
