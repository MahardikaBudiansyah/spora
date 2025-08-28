import { twMerge } from "tailwind-merge";

export default function VenueLocation({ address }) {
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
                <span className="font-semibold">Lokasi venue: </span>
                <p>{address}</p>
            </div>
        </div>
    );
}
