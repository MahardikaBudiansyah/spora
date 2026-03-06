import { useEffect, useState, useRef } from "react";
import { Camera } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { toast } from "react-toastify";
import AvatarPicker from "@/components/Common/AvatarPicker";

export default function ProfileAvatar({
    src,
    user,
    resetPreviewSignal,
    onChange,
    isLoading,
    size = "3xl",
    className = "",
    mode = "direct",
}) {
    const [preview, setPreview] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef();

    const MAX_FILE_SIZE_MB = 5;

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    useEffect(() => {
        if (src) {
            setPreview(null);
        }
    }, [src]);

    const handleTriggerClick = () => {
        if (mode === "direct") {
            fileInputRef.current?.click();
        } else {
            setShowPicker(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            toast.warning(
                `File terlalu besar! Maksimal ${MAX_FILE_SIZE_MB} MB.`,
            );
            e.target.value = "";
            return;
        }

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            toast.warning("Hanya file JPG/PNG yang diperbolehkan.");
            e.target.value = "";
            return;
        }

        const url = URL.createObjectURL(file);

        if (mode === "direct") {
            setPreview(url);
            onChange?.({ type: "file", value: file });
        } else {
            setUploadedFile({ url, file });
            setShowPicker(true);
        }

        e.target.value = "";
    };

    const handleSelectAvatar = (selectedData) => {
        setPreview(selectedData.url);

        if (selectedData.file) {
            onChange?.({ type: "file", value: selectedData.file });
        } else {
            onChange?.({ type: "path", value: selectedData.url });
        }

        setShowPicker(false);
    };

    useEffect(() => {
        if (resetPreviewSignal) setPreview(null);
    }, [resetPreviewSignal]);

    const photoSrc =
        preview ||
        (src
            ? src.startsWith("/assets") ||
              src.startsWith("http") ||
              src.startsWith("blob:") ||
              src.startsWith("/storage") ||
              src.startsWith("storage")
                ? src
                : `/storage/${src}`
            : null);

    const fallback = user?.name
        ? user.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "?";

    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            <div
                className="relative group cursor-pointer"
                onClick={handleTriggerClick}
            >
                <Avatar
                    src={photoSrc}
                    size={size}
                    rounded
                    fallback={fallback}
                    className="shadow-lg group-hover:scale-[1.02]"
                />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {!isLoading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center rounded-full
                               bg-black/40 text-white opacity-0 
                               group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <Camera className="w-1/4 h-1/4" />
                    </div>
                )}
            </div>

            {mode === "picker" && (
                <AvatarPicker
                    show={showPicker}
                    onClose={() => setShowPicker(false)}
                    onSelect={handleSelectAvatar}
                    onUploadClick={() => fileInputRef.current?.click()}
                    uploadedFile={uploadedFile}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
            />
        </div>
    );
}
