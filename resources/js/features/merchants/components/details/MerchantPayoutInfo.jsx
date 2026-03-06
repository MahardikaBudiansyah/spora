import { useState } from "react";
import { router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Copy,
    CheckCircle2,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import Badge from "@/components/Common/Badge";
import DescriptionItem from "@/components/Common/DescriptionItem";
import DeleteModal from "@/components/Common/DeleteModal";
import {
    checkSectionCompletion,
    getPayoutVerificationStatus,
    getSectionProgress,
} from "@/utils/attributes/merchantAttribute";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import ProgressBar from "@/components/Common/ProgressBar";
import ConfirmModal from "@/components/Common/ConfirmModal";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatFullDateTime } from "@/utils/date";

export default function MerchantPayoutInfo({
    merchant,
    payoutMethods = [],
    onEdit,
    onCreate,
}) {
    const [index, setIndex] = useState(0);
    const isNoData = !payoutMethods || payoutMethods.length === 0;
    const current = !isNoData ? payoutMethods[index] : null;
    const latestStatus = current?.latest_status;
    const statusInfo = getPayoutVerificationStatus(
        current?.status,
        latestStatus?.created_at,
        latestStatus,
    );
    const StatusIcon = statusInfo.icon;

    const progress = getSectionProgress(merchant, "payout", {
        currentPayout: current,
    });

    const getProgressColor = (value) => {
        if (value <= 25) return "red";
        if (value <= 50) return "orange";
        if (value <= 75) return "cyan";
        return "green";
    };

    const [direction, setDirection] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const formatAccountNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `**** ${number.slice(-4)}`;
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

    const handlePayoutVerification = (reason, id) => {
        if (!id || loading) return;

        router.patch(
            route("merchant.payouts.verification.requestVerification", {
                id: id,
            }),
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(
                        "Proses Pengajuan Pencairan Dana (Rekening) Mitra Berhasil",
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

    const handleSetPrimaryPayout = (id) => {
        router.patch(
            route("merchant.payouts.setPrimary", { id: id }),
            {},
            {
                preserveScroll: true,
                onStart: () => setLoading(true),
                onSuccess: () =>
                    toast.success("Rekening utama berhasil diperbarui"),
                onError: () => toast.error("Gagal mengubah rekening utama"),
                onFinish: () => setLoading(false),
            },
        );
    };

    const handleDelete = () => {
        const current = payoutMethods[index];

        router.delete(
            route("merchant.payouts.destroy", {
                id: current.id,
            }),
            {
                preserveScroll: true,
                onStart: () => setIsDeleting(true),
                onSuccess: () => {
                    toast.success("Rekening berhasil dihapus");
                    setShowDeleteModal(false);
                    setIndex(0);
                },
                onError: () => toast.error("Gagal menghapus rekening"),
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const actionDisplay = (
        <div className="flex items-center gap-1">
            {payoutMethods.length > 0 && current?.provider_name !== "" && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={onCreate}
                    className="text-primary-600 font-semibold px-2 py-1.5"
                >
                    Tambah
                </Button>
            )}
            {!isNoData && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(current)}
                    disabled={
                        current?.status === "pending" || current?.is_primary
                    }
                    className="text-primary-600 font-semibold px-2 py-1.5"
                >
                    {!current?.provider_name || current?.provider_name === ""
                        ? "Lengkapi Data"
                        : "Edit"}
                </Button>
            )}
            {payoutMethods.length > 1 && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={
                        isDeleting ||
                        current?.status === "pending" ||
                        current?.is_primary
                    }
                    className="text-red-600 dark:text-red-500 font-semibold px-2 py-1.5"
                >
                    Hapus
                </Button>
            )}
        </div>
    );

    const footerDisplay = (
        <div className="border-none p-5 space-y-4 bg-secondary-50/60 dark:bg-secondary-800/60 ">
            {payoutMethods.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-4">
                    {payoutMethods.map((_, i) => (
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
            )}
        </div>
    );

    return (
        <ContentCard
            variant="soft"
            icon={CreditCard}
            title="Pencairan Dana"
            action={actionDisplay}
            footer={footerDisplay}
            bodyClassName="flex-1 space-y-4"
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
                    {current?.status === "rejected" &&
                        current?.latest_status?.reason && (
                            <BannerAlert
                                type="error"
                                showIcon={false}
                                title={
                                    <span>
                                        Direview oleh:{" "}
                                        {
                                            current?.latest_status
                                                ?.change_by_snapshot
                                        }
                                    </span>
                                }
                                size="xs"
                                className="my-0"
                            >
                                <div className="space-x-2">
                                    <span>
                                        {current?.latest_status?.reason}
                                    </span>
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

                    {progress < 100 ? (
                        <ProgressBar
                            value={progress}
                            color={getProgressColor(progress)}
                            size="sm"
                            showLabel={true}
                            labelSuffix="Data Rekening Lengkap"
                        />
                    ) : (
                        <>
                            {current?.status === "draft" && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Tippy content="Privasi terjamin. Data Pencairan Dana (Rekening) hanya digunakan untuk keperluan verifikasi internal.">
                                            <ShieldCheck size={16} />
                                        </Tippy>
                                        <span className="text-xs font-bold">
                                            Data Rekening Lengkap
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
                    {!isNoData && (
                        <div className="flex justify-between items-center">
                            {current?.is_primary && (
                                <Badge
                                    color="green"
                                    className="flex items-center gap-1.5 px-2 py-1 font-bold whitespace-nowrap"
                                >
                                    <CheckCircle2 size={14} />
                                    Rekening Utama
                                </Badge>
                            )}
                            {!current?.is_primary &&
                                current?.status === "approved" && (
                                    <Button
                                        variant="light"
                                        size="xs"
                                        disabled={loading}
                                        onClick={() =>
                                            handleSetPrimaryPayout(current.id)
                                        }
                                        className="py-1 px-2 text-[10px] text-primary-600 dark:text-primary-500 font-semibold rounded-md"
                                    >
                                        {loading
                                            ? "Memproses..."
                                            : "Jadikan Utama"}
                                    </Button>
                                )}
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <DescriptionItem
                            label="Nama Bank / Provider"
                            value={
                                <span
                                    className={
                                        loading
                                            ? "opacity-50 animate-pulse"
                                            : "transition-opacity"
                                    }
                                >
                                    {current?.provider_name || "-"}
                                </span>
                            }
                            className="space-y-0 uppercase"
                        />
                        {current?.provider_name && (
                            <Badge
                                color={statusInfo.color}
                                tooltip={statusInfo.timestamp || ""}
                                className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap"
                            >
                                <StatusIcon
                                    size={14}
                                    className={
                                        current?.status === "rejected"
                                            ? "animate-pulse"
                                            : ""
                                    }
                                />
                                <span
                                    className={
                                        current?.status === "rejected"
                                            ? "animate-pulse"
                                            : ""
                                    }
                                >
                                    {statusInfo.label}
                                </span>
                            </Badge>
                        )}
                    </div>

                    <DescriptionItem
                        label="Nomor Rekening"
                        className="space-y-1"
                    >
                        <div
                            className={`flex gap-2 justify-between items-center ${
                                loading
                                    ? "opacity-50 scale-[0.98] grayscale transition-all duration-300"
                                    : " "
                            } bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700`}
                        >
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
                                                        "No Rekening berhasil disalin ke clipboard",
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
                            <Tippy content="Privasi terjamin. Data Rekening hanya digunakan untuk keperluan verifikasi internal.">
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
                        value={
                            <span
                                className={
                                    loading
                                        ? "opacity-50 animate-pulse"
                                        : "transition-opacity"
                                }
                            >
                                {current?.account_holder_name || "-"}
                            </span>
                        }
                        className="space-y-0 uppercase text-xs"
                    />
                </motion.div>
            </AnimatePresence>
            <ConfirmModal
                show={isModalOpen}
                title="Pengajuan Data Pencairan Dana (Rekening) Mitra"
                description={`Apakah Anda ingin yakin pengajuan data Rekening ${current?.account_holder_name}?`}
                confirmText="Setujui"
                requireReason={true}
                reasonPlaceholder="Tambah catatan pengajuan verifikasi di sini..."
                onConfirm={({ reason }) =>
                    handlePayoutVerification(reason, current?.id)
                }
                onClose={() => setIsModalOpen(false)}
                isProcessing={loading}
            />

            <DeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isProcessing={isDeleting}
                title="Hapus Rekening"
                description={`Apakah Anda yakin ingin menghapus rekening ${current?.provider_name} (${current?.account_number})?`}
            />
        </ContentCard>
    );
}
