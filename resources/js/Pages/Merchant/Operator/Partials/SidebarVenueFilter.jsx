import React from "react";

export default function SidebarVenueFilter({
    venues,
    selectedVenues,
    onToggleVenue,
    venueColors,
}) {
    return (
        <aside className="w-48 bg-gray-50 p-4 rounded-md shadow-inner flex-shrink-0 overflow-auto">
            <h2 className="font-semibold mb-4">Filter Venue</h2>
            {venues.map((v) => (
                <label
                    key={v.id}
                    className="flex items-center mb-2 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedVenues.includes(v.id)}
                        onChange={() => onToggleVenue(v.id)}
                    />
                    {v.name}
                </label>
            ))}

            <h2 className="font-semibold mt-6 mb-2">Legend</h2>
            <div className="flex flex-col gap-1">
                {venues.map((v) => (
                    <div key={v.id} className="flex items-center gap-2">
                        <div
                            style={{ backgroundColor: venueColors[v.id] }}
                            className="w-4 h-4 rounded-sm"
                        />
                        <span>{v.name}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
