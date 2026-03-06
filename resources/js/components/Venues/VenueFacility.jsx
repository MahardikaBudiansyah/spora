import { twMerge } from "tailwind-merge";

export default function VenueFacility({ facilities = [], showLabel = false }) {
    return (
        <div className="flex flex-col gap-2">
            {showLabel && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 ">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                        Fasilitas
                    </h3>
                </div>
            )}

            <div
                className={twMerge(
                    "grid gap-2",
                    "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6"
                )}
            >
                {facilities.map((facility, index) => (
                    <div
                        key={index}
                        className="p-2 flex flex-col gap-2 items-center text-center text-sm"
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
        </div>
    );
}
