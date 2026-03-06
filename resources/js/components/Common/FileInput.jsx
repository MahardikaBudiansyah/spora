import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function FileInput({
    id,
    accept,
    multiple = false,
    className = "",
    onChange,
    value,
    isError = false,
    label = "Pilih File",
    ...props
}) {
    const inputRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);

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

    const buttonClass = twMerge(
        "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all " +
            "focus:outline-none focus:ring-2 focus:ring-offset-2 ",
        isError
            ? "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500" // Gaya Error
            : "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500" // Gaya Normal
    );

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={triggerInput}
                    className={buttonClass}
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
                    className={twMerge(
                        "text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]",
                        isError
                            ? "text-red-500"
                            : "text-gray-700 dark:text-gray-300"
                    )}
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
