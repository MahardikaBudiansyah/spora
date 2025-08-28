import { twMerge } from "tailwind-merge";

export default function VenueFacility({ facilities = [] }) {
    return (
        <div
            className={twMerge(
                "grid gap-2",
                "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6"
            )}
        >
            {facilities.map((facility, index) => (
                <div
                    key={index}
                    className={twMerge(
                        "p-2 flex flex-col gap-2 items-center text-center text-sm"
                    )}
                >
                    <img
                        src={`/assets/icons/facilities/${facility.icon}`}
                        alt={facility.name}
                        className="w-8 h-8"
                    />
                    <span>{facility.name}</span>
                </div>
            ))}
        </div>
    );
}
