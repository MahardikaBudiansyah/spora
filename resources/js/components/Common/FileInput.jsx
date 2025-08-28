import { useRef, useState, useEffect } from "react";

export default function FileInput({
    id,
    accept,
    multiple = false,
    className = "",
    onChange,
    value,
    label = "Pilih Gambar",
    ...props
}) {
    const inputRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Sinkronisasi value jika dikontrol oleh parent
    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedFiles(value);
        }
    }, [value]);

    const triggerInput = () => {
        inputRef.current?.click();
    };

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        onChange?.(files);
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={triggerInput}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {label}
                </button>

                <input
                    id={id}
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    {...props}
                />

                <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]"
                    title={selectedFiles?.map?.((f) => f.name).join(", ")}
                >
                    {selectedFiles?.length > 0 ? (
                        <span className="font-medium">
                            {selectedFiles.length} file
                            {selectedFiles.length > 1 && "s"} dipilih
                        </span>
                    ) : (
                        <span className="italic text-gray-400">
                            Belum ada file dipilih
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
