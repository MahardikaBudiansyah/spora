import React from "react";
import Checkbox from "@/components/Common/Checkbox";

export default function FilterCalendar({
    venues,
    selectedVenues,
    onToggleVenue,
    venueColors,
}) {
    return (
        <aside className="flex flex-row gap-4 w-full bg-secondary-50 dark:bg-secondary-800 p-4 rounded-md shadow-inner flex-shrink-0 overflow-auto">
            <div>
                <h2 className="font-semibold mb-2">Filter Venue</h2>
                <div className="flex flex-col gap-2 text-sm font-semibold">
                    {venues.map((v) => (
                        <label
                            key={v.id}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={selectedVenues.includes(v.id)}
                                onChange={() => onToggleVenue(v.id)}
                            />
                            <div
                                className={`w-4 h-4 rounded-sm ${
                                    venueColors[v.id]
                                }`}
                            />
                            <span>{v.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
