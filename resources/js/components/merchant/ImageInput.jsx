import { useEffect, useRef, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";

export default function ImageInput({
    className,
    onChange,
    maxFileCount = 5,
    maxFileSize = 2 * 1024 * 1024,
    maxTotalSize = 10 * 1024 * 1024,
    showPreview = true,
    files = [],
}) {
    const fileInputRef = useRef(null);
    const isFirstRender = useRef(true);

    const initialSelectedFiles = useMemo(() => {
        return files.map((file) => ({
            ...file,
            preview: file.preview || file.url || "",
            isExisting: true,
        }));
    }, [files]);

    const [selectedFiles, setSelectedFiles] = useState(initialSelectedFiles);
    const [mainImageIndex, setMainImageIndex] = useState(() => {
        const featuredIndex = initialSelectedFiles.findIndex(
            (f) => f.is_featured
        );
        return featuredIndex !== -1 ? featuredIndex : 0;
    });

    useEffect(() => {
        return () => {
            selectedFiles
                .filter((f) => !f.isExisting && f.preview)
                .forEach((f) => URL.revokeObjectURL(f.preview));
        };
    }, [selectedFiles]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onChange?.(selectedFiles, mainImageIndex);
    }, [selectedFiles, mainImageIndex]);

    const handleFileChange = (e) => {
        const inputFiles = Array.from(e.target.files);
        const totalSize = inputFiles.reduce((acc, file) => acc + file.size, 0);

        if (inputFiles.length + selectedFiles.length > maxFileCount) {
            toast.error(`Maksimal ${maxFileCount} gambar boleh diunggah.`);
            return;
        }

        if (inputFiles.some((file) => file.size > maxFileSize)) {
            toast.error(
                `Ukuran gambar tidak boleh lebih dari ${(
                    maxFileSize /
                    1024 /
                    1024
                ).toFixed(1)}MB.`
            );
            return;
        }

        const currentSize = selectedFiles.reduce(
            (acc, f) => acc + (f.file?.size || f.size || 0),
            0
        );
        if (currentSize + totalSize > maxTotalSize) {
            toast.error(
                `Total ukuran gambar melebihi batas ${(
                    maxTotalSize /
                    1024 /
                    1024
                ).toFixed(1)}MB.`
            );
            return;
        }

        const newFiles = inputFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false,
        }));

        const updated = [...selectedFiles, ...newFiles].slice(0, maxFileCount);
        setSelectedFiles(updated);
        e.target.value = null;
    };

    const removeImage = (indexToRemove) => {
        setSelectedFiles((prev) => {
            const updated = [...prev];
            updated.splice(indexToRemove, 1);

            if (mainImageIndex >= updated.length) {
                setMainImageIndex(0);
            }

            return updated;
        });
    };

    const handleMainImageSelect = (index) => {
        setMainImageIndex(index);
    };

    const getFileName = (file) => file.file?.name || file.name || "Tanpa nama";
    const getFileSizeKB = (file) => {
        const size = file.file?.size || file.size || 0;
        return size > 0 ? `${(size / 1024).toFixed(1)} KB` : "—";
    };

    return (
        <div className={twMerge("space-y-4", className)}>
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary/90 transition"
                    >
                        Pilih Gambar
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                        {selectedFiles.length} file terpilih
                    </span>
                </div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Maksimal {maxFileCount} gambar. Ukuran per gambar max{" "}
                    {(maxFileSize / 1024 / 1024).toFixed(1)}MB.
                </span>
            </div>

            {showPreview && selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={file.id || index}
                            className="relative border border-secondary-300 dark:border-secondary-700 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => handleMainImageSelect(index)}
                        >
                            <img
                                src={file.preview}
                                alt={`preview-${index}`}
                                className="w-full h-32 object-cover"
                            />
                            {index === mainImageIndex && (
                                <div className="absolute top-1 left-1 bg-yellow-400 text-white p-1 rounded-full text-xs shadow z-30">
                                    <Star size={16} />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute top-1 right-1 z-40 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                            >
                                <X size={16} />
                            </button>

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition z-10" />
                            <div className="absolute bottom-0 left-0 w-full text-center bg-black/60 text-xs text-white py-1 opacity-0 group-hover:opacity-100 transition z-20">
                                Pilih Gambar Utama
                            </div>

                            <div
                                className="text-xs text-center text-gray-600 dark:text-gray-300 truncate px-1 mt-1"
                                title={getFileName(file)}
                            >
                                {getFileName(file)}
                            </div>
                            <div className="text-[10px] text-center text-gray-500 dark:text-gray-400">
                                {getFileSizeKB(file)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
