import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import {
    ShieldCheck,
    EyeOff,
    Eye,
    Copy,
    User,
    SquareUserRound,
} from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatTo08 } from "@/utils/numberPhone";
import ImagePlaceholder from "@/components/Common/ImagePlaceholder";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import { formatFullAddress } from "@/utils/address";
import ImageZoomModal from "@/components/Common/ImageZoomModal";
import { formatGender } from "@/utils/gender";
import { formatFullDate } from "@/utils/date";

export default function AdminProfileInfo({ admin, onEdit }) {
    const profile = admin?.profile;
    const role = admin?.role;

    const [isVisible, setIsVisible] = useState(false);

    const formatNIKNumber = (number) => {
        if (!number) return "-";
        if (isVisible) return number;
        return `${number.substring(0, 4)}**********${number.slice(-4)}`;
    };

    const [zoomImage, setZoomImage] = useState({ open: false, index: 0 });

    const images = [
        { src: profile?.photo_path, alt: "Pas Foto" },
        { src: profile?.ktp_photo_path, alt: "Foto KTP" },
        { src: profile?.selfie_photo_path, alt: "Foto Selfie" },
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

    const getButtonLabel = () => {
        if (!profile) return "Lengkapi Data";

        const fields = [
            profile.nik,
            profile.full_name,
            profile.phone_number,
            profile.photo_path,
            profile.ktp_photo_path,
            profile.address,
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
            icon={role === "superadmin" ? SquareUserRound : User}
            title={role === "superadmin" ? "Kontak Bisnis" : "Profil Admin"}
            action={actionDisplay}
            bodyClassName="flex-1 space-y-4"
        >
            <DescriptionItem label="Nama Lengkap (KTP)" className="space-y-0">
                <span className="font-medium text-secondary-900 dark:text-white">
                    {profile?.full_name || "-"}
                </span>
            </DescriptionItem>
            <div className="flex flex-row gap-4 justify-between items-center">
                <DescriptionItem
                    label="Tanggal Lahir (KTP)"
                    value={formatFullDate(profile?.date_of_birth) || "-"}
                    className="space-y-0"
                />
                <DescriptionItem
                    label="Jenis Kelamin (KTP)"
                    value={formatGender(profile?.gender) || "-"}
                    className="space-y-0"
                />
            </div>
            <DescriptionItem label="No. Handphone" className="space-y-0">
                <div className="flex gap-2 items-center ">
                    <span className="font-medium text-secondary-900 dark:text-white">
                        {formatTo08(profile?.phone_number) || "-"}
                    </span>
                    {profile?.phone_number && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                                copyToClipboard(
                                    profile.phone_number,
                                    "No. Handphone",
                                )
                            }
                            tooltip="Salin No. Handphone"
                        >
                            <Copy size={14} />
                        </Button>
                    )}
                </div>
            </DescriptionItem>
            <DescriptionItem label="NIK (KTP)" className="space-y-1">
                <div className="flex gap-2 justify-between items-center bg-secondary-100 dark:bg-secondary-800/50 p-2.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                    <div className="flex gap-2 items-center ">
                        <span className="font-mono font-bold text-sm tracking-wider">
                            {formatNIKNumber(profile?.nik)}
                        </span>
                        {profile?.nik && (
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
                                        copyToClipboard(profile.nik, "NIK")
                                    }
                                    tooltip="Salin NIK"
                                >
                                    <Copy size={14} />
                                </Button>
                            </div>
                        )}
                    </div>
                    <Tippy content="Privasi terjamin">
                        <ShieldCheck
                            className={`w-5 h-5 ${
                                profile?.nik
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
            <div className="grid md:grid-cols-2 gap-3 mt-2">
                <DescriptionItem label="Pass Foto" className="space-y-1">
                    {profile?.photo_path ? (
                        <div
                            className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                            onClick={() =>
                                setZoomImage({
                                    open: true,
                                    index: images.findIndex(
                                        (i) => i.src === profile.photo_path,
                                    ),
                                })
                            }
                        >
                            <img
                                src={profile.photo_path}
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
                    {profile?.ktp_photo_path ? (
                        <div
                            className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                            onClick={() =>
                                setZoomImage({
                                    open: true,
                                    index: images.findIndex(
                                        (i) => i.src === profile.ktp_photo_path,
                                    ),
                                })
                            }
                        >
                            <img
                                src={profile.ktp_photo_path}
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

                {role === "superadmin" && (
                    <DescriptionItem label="Foto Selfie" className="space-y-1">
                        {profile?.selfie_photo_path ? (
                            <div
                                className="relative group overflow-hidden rounded-md aspect-video bg-white cursor-zoom-in"
                                onClick={() =>
                                    setZoomImage({
                                        open: true,
                                        index: images.findIndex(
                                            (i) =>
                                                i.src ===
                                                profile.selfie_photo_path,
                                        ),
                                    })
                                }
                            >
                                <img
                                    src={profile.selfie_photo_path}
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
                )}
            </div>
            <ImageZoomModal
                open={zoomImage.open}
                image={images[zoomImage.index]?.src}
                alt={images[zoomImage.index]?.alt}
                onClose={() => setZoomImage({ ...zoomImage, open: false })}
                onPrev={images.length > 1 ? handlePrev : null}
                onNext={images.length > 1 ? handleNext : null}
            />
        </ContentCard>
    );
}
