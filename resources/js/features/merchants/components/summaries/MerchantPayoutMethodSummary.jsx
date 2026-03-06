import { useState } from "react";
import { router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Copy,
    BadgeCheck,
    Eye,
    EyeOff,
    ShieldCheck,
    Mail,
    Info,
} from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import Badge from "@/components/Common/Badge";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { getPayoutVerificationStatus } from "@/utils/attributes/merchantAttribute";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import BannerAlert from "@/components/Common/BannerAlert";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { formatFullDateTime } from "@/utils/date";

export default function MerchantPayoutMethodSummary({ merchant }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const rawPayoutMethods = merchant?.payout_methods || [];

    const payoutMethods = [...rawPayoutMethods].sort((a, b) => {
        return b.is_primary === true || b.is_primary === 1 ? 1 : -1;
    });

    const isNoData = !payoutMethods || payoutMethods.length === 0;
    const current = !isNoData ? payoutMethods[index] : null;
    const latestStatus = current?.latest_status;

    const statusPayoutMethod = getPayoutVerificationStatus(
        current?.status,
        current?.created_at,
        latestStatus,
    );
    const StatusIcon = statusPayoutMethod.icon;

    const shouldShowReason = latestStatus && !latestStatus.is_system_generated;

    const formatAccountNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `**** ${number.slice(-4)}`;
    };

    const nextStep = () => {
        if (index < payoutMethods.length - 1) {
            setDirection(1);
            setIndex(index + 1);
            setIsVisible(false);
        }
    };

    const prevStep = () => {
        if (index > 0) {
            setDirection(-1);
            setIndex(index - 1);
            setIsVisible(false);
        }
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    const footerDisplay = (
        <div className="flex justify-center gap-1.5 pb-4">
            {[0, 1].map((i) => (
                <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index
                            ? "w-4 bg-primary-500"
                            : "w-1.5 bg-secondary-300"
                    }`}
                />
            ))}
        </div>
    );

    const handleAction = (status, reason) => {
        if (loading) return;

        const payoutMethodId = isModalOpen;

        router.patch(
            route(
                "admin.merchants.verification.updatePayoutMethodVerification",
                {
                    merchant: merchant.slug,
                    payout_method: payoutMethodId,
                },
            ),
            { status, reason },
            {
                preserveScroll: true,
                onStart: () => setLoading(true),
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success("Rekening berhasil diperbarui!");
                },
                onError: (errors) => {
                    const message =
                        errors.error || "Gagal memverifikasi rekening.";
                    toast.error(message);
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    const actionDisplay = (
        <div className="flex flex-row gap-2 items-center">
            {current?.status === "pending" && (
                <Button
                    size="xs"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                    onClick={() => setIsModalOpen(current.id)}
                    className="text-[10px] py-1 px-2 rounded-md"
                >
                    Verifikasi!
                </Button>
            )}
            <div>
                <Badge
                    color={statusPayoutMethod.color}
                    tooltip={statusPayoutMethod.timestamp || ""}
                    className="flex items-center gap-1.5 px-2 py-1 font-bold whitespace-nowrap "
                >
                    <StatusIcon
                        size={14}
                        className={
                            !statusPayoutMethod.isVerified &&
                            statusPayoutMethod?.status === "pending"
                                ? "animate-pulse"
                                : ""
                        }
                    />
                    {statusPayoutMethod.label}
                </Badge>
            </div>
        </div>
    );

    if (!payoutMethods)
        return (
            <div className="text-sm text-gray-500 italic">
                Metode pembayaran belum diatur.
            </div>
        );

    return (
        <ContentCard
            variant="elevated"
            icon={CreditCard}
            title="Pencairan Dana"
            action={actionDisplay}
            bodyClassName="flex-1 space-y-4"
            footer={footerDisplay}
            className="w-full"
        >
            <div className="flex justify-end gap-1 items-center">
                {payoutMethods.length > 1 && (
                    <Badge
                        color="stone"
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                    >
                        {index + 1} / {payoutMethods.length}
                    </Badge>
                )}
                {payoutMethods.length > 1 && (
                    <div className="flex items-center mr-2">
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={prevStep}
                            disabled={index === 0}
                            className="p-1 h-7 w-7"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={nextStep}
                            disabled={index === payoutMethods.length - 1}
                            className="p-1 h-7 w-7"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                )}
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={isNoData ? "empty" : current?.id || index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="p-0 space-y-4"
                >
                    {current?.status === "pending" && shouldShowReason && (
                        <BannerAlert
                            type="info"
                            showIcon={false}
                            title="Catatan"
                            size="xs"
                            className="my-0 "
                        >
                            {latestStatus.reason}
                        </BannerAlert>
                    )}
                    {current?.status === "approved" &&
                        statusPayoutMethod.changeByName && (
                            <div className="flex justify-end">
                                <Badge color={statusPayoutMethod.color}>
                                    Disetujui oleh:{" "}
                                    {statusPayoutMethod.changeByName ||
                                        "System"}
                                </Badge>
                            </div>
                        )}
                    {current?.status === "rejected" && latestStatus?.reason && (
                        <BannerAlert
                            type="error"
                            title={
                                <span>
                                    Direview oleh:{" "}
                                    {current?.latest_status?.change_by_snapshot}
                                </span>
                            }
                            size="xs"
                            className="my-0"
                        >
                            <div className="space-x-2">
                                <span>{current?.latest_status?.reason}</span>
                                <span className="opacity-90 font-medium">
                                    (
                                    {formatFullDateTime(
                                        current?.latest_status?.created_at,
                                    )}
                                    )
                                </span>
                            </div>
                        </BannerAlert>
                    )}

                    <div className="flex justify-between items-center">
                        <DescriptionItem
                            label="Nama Bank / Provider"
                            value={current?.provider_name || "-"}
                            className="space-y-0 uppercase text-xs"
                        />
                        {!isNoData && (
                            <div className="flex items-center">
                                {current?.is_primary && (
                                    <Badge
                                        color="green"
                                        className="flex items-center gap-1.5 px-2 py-1 font-bold whitespace-nowrap "
                                    >
                                        <BadgeCheck size={14} />
                                        Rekening Utama
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <DescriptionItem
                        label="Nomor Rekening"
                        className="space-y-1"
                    >
                        <div className="flex gap-2 justify-between items-center bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                            <div className="flex gap-2 items-center ">
                                <span className="font-mono font-bold text-sm tracking-wider">
                                    {formatAccountNumber(
                                        current?.account_number,
                                    )}
                                </span>

                                {current?.account_number && (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            className="h-8 w-8 p-0"
                                            onClick={() =>
                                                setIsVisible(!isVisible)
                                            }
                                            tooltip={
                                                isVisible
                                                    ? "Sembunyikan"
                                                    : "Tampilkan"
                                            }
                                        >
                                            {isVisible ? (
                                                <EyeOff
                                                    size={14}
                                                    className="text-secondary-400"
                                                />
                                            ) : (
                                                <Eye
                                                    size={14}
                                                    className="text-secondary-400"
                                                />
                                            )}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                if (current?.account_number) {
                                                    navigator.clipboard.writeText(
                                                        current.account_number,
                                                    );
                                                    toast.success(
                                                        "No. Rekening berhasil disalin ke clipboard",
                                                        {
                                                            position:
                                                                "bottom-center",
                                                            autoClose: 3000,
                                                            hideProgressBar: true,
                                                            theme: "colored",
                                                        },
                                                    );
                                                }
                                            }}
                                            tooltip="Salin No. Rekening"
                                        >
                                            <Copy
                                                size={14}
                                                className="text-secondary-400"
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <Tippy content="Privasi terjamin. Data identitas hanya digunakan untuk keperluan verifikasi internal.">
                                <ShieldCheck
                                    className={`w-5 h-5 ${
                                        current?.account_number
                                            ? "text-green-500"
                                            : "text-secondary-400"
                                    }`}
                                />
                            </Tippy>
                        </div>
                    </DescriptionItem>

                    <DescriptionItem
                        label="Atas Nama"
                        value={current?.account_holder_name || "-"}
                        className="space-y-0 uppercase text-xs"
                    />
                </motion.div>
            </AnimatePresence>
            <ConfirmModal
                show={!!isModalOpen}
                title="Verifikasi Pencairan Dana (Rekening) Mitra"
                description={`Apakah Anda ingin menyetujui atau menolak data rekening dari ${current?.account_holder_name}?`}
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
