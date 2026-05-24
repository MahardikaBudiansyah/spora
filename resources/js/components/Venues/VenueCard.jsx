import Button from "@/components/Common/Button";

export default function VenueCard({ venue }) {
    const percentage =
        venue.total_slots > 0
            ? Math.round((venue.booked_slots / venue.total_slots) * 100)
            : 0;

    return (
        <div className="bg-white dark:bg-secondary-800 border rounded-lg p-4 shadow-sm flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="font-bold text-base">{venue.name}</h3>
                <p className="text-xs text-secondary-500">
                    {venue.total_courts} Lapangan
                </p>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1 text-xs">
                <p>Membership: {venue.total_membership} paket</p>
                <p>Member: {venue.total_members} orang</p>
                <p>
                    Booking hari ini: {venue.booked_slots} / {venue.total_slots}{" "}
                    slot
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                        className="h-2 bg-primary-500 rounded"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-[10px] text-right mt-1">{percentage}%</p>
            </div>

            {/* Action */}
            <div className="mt-4">
                <Button
                    size="xs"
                    variant="primary"
                    href={route("merchant.venues.show", venue.slug)}
                >
                    Kelola Venue
                </Button>
            </div>
        </div>
    );
}
