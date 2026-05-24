import { twMerge } from "tailwind-merge";

export default function VenueAddress({ address, showLabel = false }) {
    if (!address) return null;

    return (
        <div
            className={twMerge(
                "my-4 py-4 border-y",
                "border-secondary-300 dark:border-secondary-700",
            )}
        >
            <div
                className={twMerge(
                    "p-4 rounded-md",
                    "bg-secondary-100 dark:bg-secondary-900",
                )}
            >
                {showLabel && (
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                            Lokasi
                        </h3>
                    </div>
                )}

                <p className="whitespace-pre-line text-sm leading-relaxed text-secondary-900 dark:text-secondary-100">
                    {[
                        address.full_address,
                        `${address.village ?? ""}${
                            address.district ? ", " + address.district : ""
                        }`,
                        `${address.city ?? ""}${
                            address.province ? ", " + address.province : ""
                        }`,
                        address.postal_code,
                    ]
                        .filter(Boolean)
                        .join("\n")}
                </p>
            </div>
        </div>
    );
}
