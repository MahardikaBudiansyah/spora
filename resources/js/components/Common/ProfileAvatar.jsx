import { useEffect, useState, useRef } from "react";
import { Camera } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { toast } from "react-toastify";

export default function ProfileAvatar({
    user,
    resetPreviewSignal,
    onChange,
    size = "profile", // default size: sm, md, lg, xl, profile
    className = "", // tambahan class dari parent
}) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    const MAX_FILE_SIZE_MB = 5; // batas maksimal 5 MB

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // cek ukuran file
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_FILE_SIZE_MB) {
            toast.warning(
                `File terlalu besar! Maksimal ${MAX_FILE_SIZE_MB} MB.`
            );
            e.target.value = null; // reset input
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            toast.warning("Hanya file JPEG/PNG yang diperbolehkan.");
            e.target.value = null;
            return;
        }

        // kalau lolos validasi
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange?.(file);
        console.log("Selected file:", file);
    };

    useEffect(() => {
        if (!user?.photo) setPreview(null);
    }, [user]);

    useEffect(() => {
        if (resetPreviewSignal) {
            setPreview(null);
        }
    }, [resetPreviewSignal]);

    const photoSrc = preview || (user?.photo ? `/storage/${user.photo}` : null);

    const fallback = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "?";

    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            {/* Avatar dengan overlay kamera */}
            <div className="relative group">
                <Avatar
                    src={photoSrc}
                    size={size}
                    rounded
                    fallback={fallback}
                    className="transition-all duration-200"
                />
                {/* Tombol overlay */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full
                               bg-black bg-opacity-30 text-white opacity-0 
                               group-hover:opacity-100 transition-opacity"
                    aria-label="Ganti foto profil"
                >
                    <Camera className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </div>

            {/* Input file hidden */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
}
