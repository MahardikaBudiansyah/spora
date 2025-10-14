import { twMerge } from "tailwind-merge";

export default function VenueAddress({ address }) {
    if (!address) return null;

    return (
        <div
            className={twMerge(
                "my-4 py-4 border-y",
                "border-secondary-300 dark:border-secondary-700"
            )}
        >
            <div
                className={twMerge(
                    "p-4 rounded-md",
                    "bg-secondary-100 dark:bg-secondary-800"
                )}
            >
                <span className="font-semibold">Alamat venue: </span>
                <p className="whitespace-pre-line">
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
