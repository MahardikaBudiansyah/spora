import { useState } from "react";
import { router } from "@inertiajs/react";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import Avatar from "@/components/Common/Avatar";
import { ShieldCheck, EyeOff, Eye, Copy, User } from "lucide-react";
import { formatTo08 } from "@/utils/numberPhone";
import Tippy from "@tippyjs/react";
import Button from "@/components/Common/Button";
import { formatFullDate, formatFullDateTime } from "@/utils/date";
import { formatGender } from "@/utils/gender";
import { toast } from "react-toastify";
import { formatFullAddress } from "@/utils/address";
import ImagePlaceholder from "@/components/Common/ImagePlaceholder";
import ImageZoomModal from "@/components/Common/ImageZoomModal";
import { getOwnerVerificationStatus } from "@/utils/attributes/merchantAttribute";
import Badge from "@/components/Common/Badge";
import ConfirmModal from "@/components/Common/ConfirmModal";
import BannerAlert from "@/components/Common/BannerAlert";

export default function MerchantOwnerSummary({ merchant }) {
    const owner = merchant?.owner;
    const latestStatus = owner?.latest_status;

    const statusOwner = getOwnerVerificationStatus(
        owner?.status,
        latestStatus?.created_at,
        latestStatus,
    );

    const StatusIcon = statusOwner.icon;

    const shouldShowReason = latestStatus && !latestStatus.is_system_generated;

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const getInitial = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

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

    const handleAction = (status, reason) => {
        if (loading) return;

        router.patch(
            route(
                "admin.merchants.verification.updateMerchantOwnerVerification",
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
            {owner?.status === "pending" && (
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
                    color={statusOwner.color}
                    tooltip={statusOwner.timestamp || ""}
                    className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap "
                >
                    <StatusIcon
                        size={14}
                        className={
                            owner?.status === "rejected" ? "animate-pulse" : ""
                        }
                    />
                    <span
                        className={
                            owner?.status === "rejected" ? "animate-pulse" : ""
                        }
                    >
                        {statusOwner.label}
                    </span>
                </Badge>
            </div>
        </div>
    );

    return (
        <ContentCard
            variant="elevated"
            icon={User}
            title="Owner Mitra"
            action={actionDisplay}
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            {owner?.status === "pending" && shouldShowReason && (
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
            {owner?.status === "approved" && statusOwner.changeByName && (
                <div className="flex justify-end">
                    <Badge color={statusOwner.color}>
                        Direview oleh: {statusOwner.changeByName || "System"}
                    </Badge>
                </div>
            )}
            {owner?.status === "rejected" && latestStatus?.reason && (
                <BannerAlert
                    type="error"
                    title={
                        <span>
                            Disetujui oleh: {latestStatus?.change_by_snapshot}
                        </span>
                    }
                    size="xs"
                    className="my-0"
                >
                    <div className="space-x-2">
                        <span>{latestStatus?.reason}</span>
                        <span className="opacity-90 font-medium">
                            ({formatFullDateTime(latestStatus?.created_at)})
                        </span>
                    </div>
                </BannerAlert>
            )}
            <div className="flex items-center gap-4 mb-6">
                <Avatar
                    src={owner?.photo_path}
                    user={{
                        name: owner?.name,
                        photo: owner?.photo_path,
                    }}
                    size="xl"
                    fallback={getInitial(owner?.name)}
                    allowZoom={true}
                    className="shadow-none shrink-0 bg"
                />
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-secondary-900 dark:text-white leading-tight">
                        {owner?.name || "-"}
                    </span>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-primary-600 dark:text-primary-500">
                        <User size={14} />
                        <span className="text-xs font-medium">Owner Mitra</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <DescriptionItem
                    label="Nama Lengkap (KTP)"
                    value={owner?.name || "-"}
                    className="space-y-0"
                />
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
                                            copyToClipboard(owner?.nik, "NIK")
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
                    {/*  <DescriptionItem label="Pass Foto" className="space-y-1">
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
                    </DescriptionItem> */}
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
                onClose={() => setIsModalOpen(false)}
                title="Verifikasi Owner"
                description={`Apakah Anda ingin menyetujui atau menolak data dari ${owner?.name}?`}
                confirmText="Setujui"
                requireReason={true}
                rejectText="Tolak Data"
                onConfirm={({ reason }) => handleAction("approved", reason)}
                onReject={({ reason }) => handleAction("rejected", reason)}
                validateReject={(reason) => reason.trim().length < 10}
                rejectHint="* Tuliskan alasan penolakan minimal 10 karakter."
                isProcessing={loading}
            />
        </ContentCard>
    );
}
