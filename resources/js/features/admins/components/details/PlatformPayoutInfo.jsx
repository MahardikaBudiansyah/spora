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
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";

export default function PlatformPayoutInfo({ admin, onEdit, onCreate }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const PayoutMethods = admin?.platform_profile?.payout_methods || [];

    const sortedPayoutMethods = [...PayoutMethods].sort((a, b) => {
        return b.is_primary === true || b.is_primary === 1 ? 1 : -1;
    });

    const nextStep = () => {
        if (index < sortedPayoutMethods.length - 1) {
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

    const isNoData = !sortedPayoutMethods || sortedPayoutMethods.length === 0;
    const current = !isNoData ? sortedPayoutMethods[index] : null;

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

    const handleSetPrimaryPayout = (id) => {
        router.patch(
            route("admin.profile.platform.payouts.setPrimary", { id: id }),
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
        const currentPayout = sortedPayoutMethods[index];

        router.delete(
            route("admin.profile.platform.payouts.destroy", {
                id: currentPayout.id,
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

    const footerDisplay = (
        <div className="border-none p-5 space-y-4 bg-secondary-50/60 dark:bg-secondary-800/60 ">
            {sortedPayoutMethods.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-4">
                    {sortedPayoutMethods.map((_, i) => (
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

    const actionDisplay = (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="xs"
                onClick={onCreate}
                className="text-primary-600 font-semibold px-2 py-1.5"
            >
                Tambah
            </Button>
            {!isNoData && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(current)}
                    className="text-primary-600 font-semibold px-2 py-1.5"
                >
                    Edit
                </Button>
            )}
            {!isNoData && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-600 dark:text-red-500 font-semibold px-2 py-1.5"
                >
                    Hapus
                </Button>
            )}
        </div>
    );

    return (
        <ContentCard
            variant="soft"
            icon={CreditCard}
            title="Pencairan Dana"
            action={actionDisplay}
            bodyClassName="flex-1 space-y-4"
            footer={footerDisplay}
            className="w-full"
        >
            <div className="flex justify-end gap-1 items-center">
                {sortedPayoutMethods.length > 1 && (
                    <Badge
                        color="stone"
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                    >
                        {index + 1} / {sortedPayoutMethods.length}
                    </Badge>
                )}
                {sortedPayoutMethods.length > 1 && (
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
                            disabled={index === sortedPayoutMethods.length - 1}
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
                    {!isNoData && (
                        <div className="flex items-center">
                            {current?.is_primary && (
                                <Badge
                                    color="green"
                                    className="flex items-center gap-1.5 px-2 py-1 font-bold whitespace-nowrap"
                                >
                                    <CheckCircle2 size={14} />
                                    Rekening Utama
                                </Badge>
                            )}
                            {!current?.is_primary && (
                                <Button
                                    variant="light"
                                    size="xs"
                                    disabled={loading}
                                    onClick={() =>
                                        handleSetPrimaryPayout(current.id)
                                    }
                                    className="py-1 px-2 text-[10px] text-primary-600 dark:text-primary-500 font-semibold rounded-md"
                                >
                                    {loading ? "Memproses..." : "Jadikan Utama"}
                                </Button>
                            )}
                        </div>
                    )}

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
                            <Tippy content="Privasi terjamin.">
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
