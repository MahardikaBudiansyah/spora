import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import { Copy, Eye, EyeOff, Info, ShieldCheck, User } from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatTo08 } from "@/utils/numberPhone";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import { formatFullAddress } from "@/utils/address";
import ImageZoomModal from "@/components/Common/ImageZoomModal";
import ImagePlaceholder from "@/components/Common/ImagePlaceholder";
import { formatGender } from "@/utils/gender";
import { formatFullDate, formatFullDateTime } from "@/utils/date";
import {
    checkSectionCompletion,
    getOwnerVerificationStatus,
    getSectionProgress,
} from "@/utils/attributes/merchantAttribute";
import Badge from "@/components/Common/Badge";
import ProgressBar from "@/components/Common/ProgressBar";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { router } from "@inertiajs/react";
import BannerAlert from "@/components/Common/BannerAlert";

export default function MerchantOwnerInfo({ merchant, onEdit }) {
    const owner = merchant?.owner;
    const latestStatus = owner?.latest_status;
    const statusOwner = getOwnerVerificationStatus(
        owner?.status,
        latestStatus?.created_at,
        latestStatus,
    );
    const StatusIcon = statusOwner.icon;

    const isOwnerComplete = checkSectionCompletion(merchant, "owner");
    const progress = getSectionProgress(merchant, "owner");
    const getProgressColor = (value) => {
        if (value <= 25) return "red";
        if (value <= 50) return "orange";
        if (value <= 75) return "cyan";
        return "green";
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatNIKNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `${number.substring(0, 4)}**********${number.slice(-4)}`;
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

    const getButtonLabel = () => {
        if (!owner) return "Lengkapi Data";

        const fields = [
            owner.name,
            owner.nik,
            owner.phone_number,
            owner.email,
            owner.date_of_birth,
            owner.gender,
            owner.photo_path,
            owner.ktp_photo_path,
            owner.selfie_photo_path,
            owner.address,
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
                disabled={owner?.status === "pending"}
                className="text-primary-600 font-semibold px-2 py-1.5"
            >
                {getButtonLabel()}
            </Button>
        </div>
    );

    const [zoomImage, setZoomImage] = useState({ open: false, index: 0 });

    const images = [
        { src: owner?.photo_path, alt: "Pass Foto" },
        { src: owner?.ktp_photo_path, alt: "Foto KTP" },
        { src: owner?.selfie_photo_path, alt: "Foto Selfie" },
    ].filter((img) => !!img.src);

    const handlePrev = () => {
        setZoomImage((prev) => ({
            ...prev,
            index: (prev.index + images.length - 1) % images.length,
        }));
    };

    const handleNext = () => {
        setZoomImage((prev) => ({
            ...prev,
            index: (prev.index + 1) % images.length,
        }));
    };

    const handleOwnerVerification = (reason) => {
        if (loading) return;

        router.patch(
            route("merchant.owner.verification.requestVerification"),
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(
                        "Proses Pengajuan Profil Owner Mitra Berhasil",
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
            icon={User}
            title="Profil Owner"
            action={actionDisplay}
            bodyClassName="flex-1 space-y-4"
        >
            {owner?.status === "rejected" && owner?.latest_status?.reason && (
                <BannerAlert
                    type="error"
                    title={
                        <span>
                            Direview oleh:{" "}
                            {owner?.latest_status?.change_by_snapshot}
                        </span>
                    }
                    size="xs"
                    className="my-0"
                >
                    <div className="space-x-2">
                        <span>{owner?.latest_status?.reason}</span>
                        <span className="opacity-90 font-medium">
                            (
                            {formatFullDateTime(
                                owner?.latest_status?.created_at,
                            )}
                            )
                        </span>
                    </div>
                </BannerAlert>
            )}

            {!isOwnerComplete ? (
                <ProgressBar
                    value={progress}
                    color={getProgressColor(progress)}
                    size="sm"
                    showLabel={true}
                    labelSuffix="Data Owner Lengkap"
                />
            ) : (
                <>
                    {owner?.status === "draft" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-green-600">
                                <Tippy content="Privasi terjamin. Data Owner Mitra hanya digunakan untuk keperluan verifikasi internal.">
                                    <ShieldCheck size={16} />
                                </Tippy>
                                <span className="text-xs font-bold">
                                    Data Owner Lengkap
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

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <DescriptionItem
                        label="Nama (KTP)"
                        value={owner?.name || "-"}
                        className="space-y-0"
                    />
                    {owner?.name && (
                        <Badge
                            color={statusOwner.color}
                            tooltip={statusOwner.timestamp || ""}
                            className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap"
                        >
                            <StatusIcon
                                size={14}
                                className={
                                    owner?.status === "rejected"
                                        ? "animate-pulse"
                                        : ""
                                }
                            />
                            <span
                                className={
                                    owner?.status === "rejected"
                                        ? "animate-pulse"
                                        : ""
                                }
                            >
                                {statusOwner.label}
                            </span>
                        </Badge>
                    )}
                </div>
                <div className="flex flex-row gap-4 justify-between items-center">
                    <DescriptionItem
                        label="Tanggal Lahir (KTP)"
                        value={formatFullDate(owner?.date_of_birth) || "-"}
                        className="space-y-0"
                    />
                    <DescriptionItem
                        label="Jenis Kelamin (KTP)"
                        value={formatGender(owner?.gender) || "-"}
                        className="space-y-0"
                    />
                </div>
                <DescriptionItem label="NIK (KTP)" className="space-y-1">
                    <div className="flex gap-2 justify-between items-center bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                        <div className="flex gap-2 items-center ">
                            <span className="font-mono font-bold text-sm tracking-wider">
                                {formatNIKNumber(owner?.nik)}
                            </span>
                            {owner?.nik && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setIsVisible(!isVisible)}
                                        tooltip={
                                            isVisible
                                                ? "Sembunyikan"
                                                : "Tampilkan"
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
                                            copyToClipboard(owner.nik, "NIK")
                                        }
                                        tooltip="Salin NIK"
                                    >
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Tippy content="Privasi terjamin. Data identitas hanya digunakan untuk verifikasi.">
                            <ShieldCheck
                                className={`w-5 h-5 ${
                                    owner?.nik
                                        ? "text-green-500"
                                        : "text-secondary-400"
                                }`}
                            />
                        </Tippy>
                    </div>
                </DescriptionItem>
                <DescriptionItem label="Alamat (KTP)" className="space-y-1">
                    <div className="flex gap-2 items-center ">
                        <span className="text-xs">
                            {formatFullAddress(owner?.address?.full_address) ||
                                "-"}
                        </span>
                        {owner?.address?.full_address && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    copyToClipboard(
                                        owner.address?.full_address,
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
                <DescriptionItem
                    label="Email"
                    value={owner?.email || "-"}
                    className="space-y-0"
                />
                <DescriptionItem
                    label="No. Handphone"
                    value={formatTo08(owner?.phone_number) || "-"}
                    className="space-y-0"
                />
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                    <DescriptionItem label="Pass Foto" className="space-y-1">
                        {owner?.photo_path ? (
                            <div
                                className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                                onClick={() =>
                                    setZoomImage({
                                        open: true,
                                        index: images.findIndex(
                                            (i) => i.src === owner.photo_path,
                                        ),
                                    })
                                }
                            >
                                <img
                                    src={owner.photo_path}
                                    alt="photo"
                                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                        ) : (
                            <ImagePlaceholder
                                label="Pass Foto Belum di Unggah!"
                                tooltip="Pass Foto Belum di Unggah!"
                            />
                        )}
                    </DescriptionItem>
                    <DescriptionItem label="Foto KTP" className="space-y-1">
                        {owner?.ktp_photo_path ? (
                            <div
                                className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                                onClick={() =>
                                    setZoomImage({
                                        open: true,
                                        index: images.findIndex(
                                            (i) =>
                                                i.src === owner.ktp_photo_path,
                                        ),
                                    })
                                }
                            >
                                <img
                                    src={owner.ktp_photo_path}
                                    alt="KTP"
                                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                        ) : (
                            <ImagePlaceholder
                                label="Foto KTP Belum di Unggah!"
                                tooltip="Foto KTP Belum di Unggah!"
                            />
                        )}
                    </DescriptionItem>

                    <DescriptionItem label="Foto Selfie" className="space-y-1">
                        {owner?.selfie_photo_path ? (
                            <div
                                className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                                onClick={() =>
                                    setZoomImage({
                                        open: true,
                                        index: images.findIndex(
                                            (i) =>
                                                i.src ===
                                                owner.selfie_photo_path,
                                        ),
                                    })
                                }
                            >
                                <img
                                    src={owner.selfie_photo_path}
                                    alt="Selfie"
                                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                        ) : (
                            <ImagePlaceholder
                                label="Foto Selfie Belum di Unggah!"
                                tooltip="Foto Selfie Belum di Unggah!"
                            />
                        )}
                    </DescriptionItem>
                </div>
            </div>
            <ImageZoomModal
                open={zoomImage.open}
                image={images[zoomImage.index]?.src}
                alt={images[zoomImage.index]?.alt}
                onClose={() => setZoomImage({ ...zoomImage, open: false })}
                onPrev={images.length > 1 ? handlePrev : null}
                onNext={images.length > 1 ? handleNext : null}
            />
            <ConfirmModal
                show={isModalOpen}
                title="Pengajuan Data Profil Owner Mitra"
                description={`Apakah Anda ingin yakin pengajuan data Profil Data Owner ${owner?.name}?`}
                confirmText="Setujui"
                requireReason={true}
                reasonPlaceholder="Tambah catatan pengajuan verifikasi di sini..."
                onConfirm={({ reason }) => handleOwnerVerification(reason)}
                onClose={() => setIsModalOpen(false)}
                isProcessing={loading}
            />
        </ContentCard>
    );
}
