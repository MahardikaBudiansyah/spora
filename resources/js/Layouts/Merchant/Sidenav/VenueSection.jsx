import { usePage } from "@inertiajs/react";
import SidenavLink from "@/components/Common/SidenavLink"; // Sesuaikan path ya
import { ChevronRight, FolderArchive, Folder } from "lucide-react";

export default function VenueSection({ venue, toggle, isOpen }) {
    const { url } = usePage();

    const basePath = `/merchant/venues/${venue.slug}`;
    const isAnyChildActive = url.startsWith(basePath);

    return (
        <ul className="ml-2 py-1 flex flex-col gap-2 text-sm font-medium">
            <li>
                <div
                    onClick={() => toggle(`venue-${venue.slug}`)}
                    className={`flex justify-between px-4 py-2 rounded-md cursor-pointer 
                        hover:bg-primary-400 dark:hover:text-dark 
                        ${isAnyChildActive ? "bg-primary-400 text-dark" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <FolderArchive className="w-5" />
                        <span>{venue.name}</span>
                    </div>
                    <ChevronRight
                        className={`w-4 transition-transform ${
                            isOpen ? "rotate-90" : ""
                        }`}
                    />
                </div>
            </li>

            {(isOpen || isAnyChildActive) && (
                <ul className="ml-2 flex flex-col gap-1">
                    {/* <li>
                        <SidenavLink
                            href={route("merchant.venues.operators.index", {
                                venue: venue.slug,
                            })}
                            routeName="merchant.venues.operators.index"
                            params={{ venue: venue.slug }}
                            label="Operator"
                            icon={Folder}
                        />
                    </li> */}
                    <li>
                        <SidenavLink
                            href={route("merchant.venues.memberships.index", {
                                venue: venue.slug,
                            })}
                            routeName="merchant.venues.memberships.index"
                            params={{ venue: venue.slug }}
                            label="Memberships"
                            icon={Folder}
                        />
                    </li>
                    <li>
                        <SidenavLink
                            href={route("merchant.venues.fields.index", {
                                venue: venue.slug,
                            })}
                            routeName="merchant.venues.fields.index"
                            params={{ venue: venue.slug }}
                            label="Lapangan"
                            icon={Folder}
                        />
                    </li>
                    <li>
                        <SidenavLink
                            href={route("merchant.venues.bookings.index", {
                                venue: venue.slug,
                            })}
                            routeName="merchant.venues.bookings.index"
                            params={{ venue: venue.slug }}
                            label="Booking"
                            icon={Folder}
                        />
                    </li>
                    <li>
                        <SidenavLink
                            href="dashboard/transaksi"
                            routeName="merchant.settings"
                            label="Transaksi"
                            icon={Folder}
                        />
                    </li>
                </ul>
            )}
        </ul>
    );
}
