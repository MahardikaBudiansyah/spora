import { useEffect, useRef, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { ImagePlus, RefreshCcw, Star, X } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/Common/Button";
import IconButton from "@/components/Common/IconButton";
import Badge from "./Badge";

export default function ImageInput({
    className,
    onChange,
    maxFileCount = 5,
    maxFileSize = 2 * 1024 * 1024,
    maxTotalSize = 10 * 1024 * 1024,
    showPreview = true,
    files = [],
    allowFeatured = true,
}) {
    const fileInputRef = useRef(null);
    const isFirstRender = useRef(true);

    const formattedInitialFiles = useMemo(() => {
        return files.map((file) => ({
            id: file.id || null,
            preview: file.preview || file.url || file.image_path_url || "",
            isExisting: true,
            file: null,
            size: file.size || 0,
        }));
    }, [JSON.stringify(files)]);

    const [selectedFiles, setSelectedFiles] = useState(formattedInitialFiles);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        if (files.length > 0 && selectedFiles.length === 0) {
            setSelectedFiles(formattedInitialFiles);
        }
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const handler = setTimeout(() => {
            onChange?.(selectedFiles, mainImageIndex);
        }, 100);

        return () => clearTimeout(handler);
    }, [selectedFiles, mainImageIndex]);

    useEffect(() => {
        return () => {
            selectedFiles.forEach((f) => {
                if (!f.isExisting && f.preview?.startsWith("blob:")) {
                    URL.revokeObjectURL(f.preview);
                }
            });
        };
    }, []);

    useEffect(() => {
        const featuredIndex = files.findIndex((f) => f.is_featured);
        if (featuredIndex !== -1) {
            setMainImageIndex(featuredIndex);
        }
    }, [files]);

    const handleFileChange = (e) => {
        const inputFiles = Array.from(e.target.files);
        const currentCount = selectedFiles.length;
        const availableSlots = maxFileCount - currentCount;

        if (availableSlots <= 0) {
            toast.error("Slot gambar sudah penuh.");
            return;
        }

        let filesToProcess = inputFiles.slice(0, availableSlots);
        if (inputFiles.length > availableSlots) {
            toast.warning(
                `Hanya ${availableSlots} gambar yang dapat ditambahkan.`
            );
        }

        const newEntries = [];
        let tempTotalSize = selectedFiles.reduce(
            (acc, f) => acc + (f.file?.size || f.size || 0),
            0
        );

        for (const file of filesToProcess) {
            if (file.size > maxFileSize) {
                toast.error(
                    `${file.name} terlalu besar (Max ${
                        maxFileSize / 1024 / 1024
                    }MB)`
                );
                continue;
            }

            if (tempTotalSize + file.size > maxTotalSize) {
                toast.error("Total ukuran file melebihi batas.");
                break;
            }

            tempTotalSize += file.size;
            newEntries.push({
                id: `new-${Date.now()}-${Math.random()}`,
                file: file,
                preview: URL.createObjectURL(file),
                isExisting: false,
                size: file.size,
            });
        }

        if (newEntries.length > 0) {
            setSelectedFiles((prev) => [...prev, ...newEntries]);
        }
        e.target.value = null;
    };

    const removeImage = (indexToRemove) => {
        const fileToRemove = selectedFiles[indexToRemove];

        if (
            !fileToRemove.isExisting &&
            fileToRemove.preview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(fileToRemove.preview);
        }

        setSelectedFiles((prev) => {
            const updated = prev.filter((_, index) => index !== indexToRemove);

            if (indexToRemove === mainImageIndex) {
                setMainImageIndex(0);
            } else if (indexToRemove < mainImageIndex) {
                setMainImageIndex(mainImageIndex - 1);
            }
            return updated;
        });
    };

    const isFull = selectedFiles.length >= maxFileCount;

    return (
        <div className={twMerge("space-y-4", className)}>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={maxFileCount > 1}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {(!isFull || maxFileCount === 1) && (
                    <Button
                        type="button"
                        size="xs"
                        variant={isFull ? "light" : "primary"}
                        onClick={() => {
                            if (isFull && maxFileCount === 1) {
                                setSelectedFiles([]);
                                setTimeout(
                                    () => fileInputRef.current?.click(),
                                    10
                                );
                            } else {
                                fileInputRef.current?.click();
                            }
                        }}
                    >
                        {isFull && maxFileCount === 1 ? (
                            <RefreshCcw className="w-3 h-3 mr-2" />
                        ) : (
                            <ImagePlus className="w-3 h-3 mr-2" />
                        )}
                        {isFull && maxFileCount === 1
                            ? "Ganti"
                            : "Pilih Gambar"}
                    </Button>
                )}
                <span className="text-xs text-secondary-500 dark:text-secondary-100">
                    {selectedFiles.length} / {maxFileCount} Gambar Terpilih
                </span>
            </div>

            {showPreview && selectedFiles.length > 0 && (
                <div
                    className={twMerge(
                        "grid gap-4",
                        maxFileCount === 1
                            ? "grid-cols-1 max-w-xs"
                            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    )}
                >
                    {selectedFiles.map((file, index) => (
                        <div key={file.id || index} className="group relative">
                            <div
                                onClick={() =>
                                    allowFeatured && setMainImageIndex(index)
                                }
                                className={twMerge(
                                    "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                                    index === mainImageIndex && allowFeatured
                                        ? "border-yellow-400 ring-2 ring-yellow-400/80"
                                        : "border-secondary-200 dark:border-secondary-700 hover:border-secondary-400 dark:hover:border-secondary-600"
                                )}
                            >
                                <img
                                    src={file.preview}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />

                                <div className="absolute top-1 right-1">
                                    <IconButton
                                        variant="danger"
                                        size="xs"
                                        className="rounded-full shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                    >
                                        <X size={12} />
                                    </IconButton>
                                </div>

                                {allowFeatured && (
                                    <div
                                        className={twMerge(
                                            "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none",
                                            index === mainImageIndex &&
                                                "opacity-100 bg-transparent"
                                        )}
                                    >
                                        {index === mainImageIndex ? (
                                            <div className="absolute bottom-2 left-2 bg-yellow-400 text-white px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                                <Star
                                                    size={10}
                                                    fill="currentColor"
                                                />
                                                <span className="text-[10px] font-bold uppercase">
                                                    Utama
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="bg-secondary-600/50 dark:bg-secondary-800/50  text-white text-[10px] px-2 py-1 rounded-md font-semibold shadow-sm">
                                                Jadikan Utama
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-1 text-center">
                                {file.isExisting ? (
                                    <Badge
                                        color="green"
                                        className="text-[10px]"
                                    >
                                        Tersimpan
                                    </Badge>
                                ) : (
                                    <Badge className="text-[10px] font-medium italic">
                                        Baru ({(file.size / 1024).toFixed(0)}{" "}
                                        KB)
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
