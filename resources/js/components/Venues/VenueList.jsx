import { router } from "@inertiajs/react";
import { Card, CardBody, CardHeader } from "@/components/Common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/Common/Badge";
import { MapPin, Calendar, Info, Store, ChevronRight } from "lucide-react";
import { getCourtSurface } from "@/utils/attributes/courtAttribute";
import { formatDistrictCity } from "@/utils/address";

export default function VenueList({ merchant, venues = [] }) {
    if (!venues || venues.length === 0) {
        return (
            <div className="bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-md p-10 text-center">
                <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                    Belum ada venue yang terdaftar di {merchant.name}.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {venues.map((venue) => (
                <Card key={venue.id} className="shadow-sm border-secondary-50">
                    {/* Header Venue */}
                    <CardHeader className="p-4 flex justify-between items-start gap-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500 flex items-center justify-center text-primary-600 dark:text-primary-50 flex-shrink-0">
                                <Store size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                                    {venue.name}
                                </h3>
                                <p className="text-xs text-secondary-500 flex items-center gap-1 mt-1 truncate">
                                    <MapPin
                                        size={12}
                                        className="text-secondary-400 flex-shrink-0"
                                    />
                                    <span className="truncate text-secondary-500 dark:text-secondary-400 text-xs">
                                        {venue?.address?.district &&
                                        venue?.address?.city ? (
                                            <span className="capitalize">
                                                {formatDistrictCity(
                                                    venue.address.district,
                                                    venue.address.city,
                                                )}
                                            </span>
                                        ) : (
                                            "Alamat Tidak Ada"
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="xs"
                            className="text-primary-500"
                            href={route("merchant.venues.show", venue.slug)}
                        >
                            Detail <ChevronRight size={14} />
                        </Button>
                    </CardHeader>
                    <CardBody className="px-4 pb-4 pt-2 bg-secondary-50/60 dark:bg-secondary-800/60 mt-auto">
                        <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-300 uppercase tracking-widest mb-2">
                            Lapangan ({venue.courts?.length || 0})
                        </p>

                        <div className="space-y-2">
                            {venue.courts?.slice(0, 3).map((court) => (
                                <div
                                    key={court.id}
                                    className="flex items-center gap-3 p-2 bg-white dark:bg-secondary-900 rounded-lg border border-secondary-200/50 dark:border-secondary-700  hover:bg-secondary-50 dark:hover:bg-secondary-800 shadow-sm"
                                >
                                    <img
                                        src={
                                            court.image ||
                                            "/assets/images/court-default.jpg"
                                        }
                                        className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                                        alt={court.name}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">
                                            {court.name}
                                        </p>
                                        <Badge
                                            color={
                                                getCourtSurface(court.surface)
                                                    .color
                                            }
                                            size="xs"
                                            className="text-[8px] leading-none px-1 py-0 h-4"
                                        >
                                            {
                                                getCourtSurface(court.surface)
                                                    .label
                                            }
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            href={route(
                                                "merchant.venues.courts.show",
                                                {
                                                    venue: venue.slug,
                                                    court: court.slug,
                                                },
                                            )}
                                            tooltip="Info"
                                            className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600   focus:ring-2 dark:focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                                        >
                                            <Info
                                                className="w-4 h-4"
                                                strokeWidth={2.5}
                                            />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            href={route(
                                                "merchant.venues.courts.calendar",
                                                {
                                                    venue: venue.slug,
                                                    court: court.slug,
                                                },
                                            )}
                                            tooltip="Kalender"
                                            className="p-2 text-orange-500 hover:text-orange-600 dark:text-orange-500 dark:hover:text-orange-600    focus:ring-2 dark:focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500"
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {venue.courts?.length > 3 && (
                                <button
                                    onClick={() =>
                                        router.get(
                                            route(
                                                "merchant.venues.show",
                                                venue.slug,
                                            ),
                                        )
                                    }
                                    className="w-full text-center text-[11px] text-secondary-400 hover:text-primary-600 transition pt-1 font-medium"
                                >
                                    +{venue.courts.length - 3} Lapangan Lainnya
                                </button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
