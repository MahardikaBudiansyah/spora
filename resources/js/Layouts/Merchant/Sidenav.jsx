import { usePage } from "@inertiajs/react";
import useToggleMap from "@/hooks/useToggleMap";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import AppLogo from "@/components/Common/AppLogo";
import AccountSection from "@/Layouts/Merchant/Sidenav/AccountSection";
import DashboardSection from "@/Layouts/Merchant/Sidenav/DashboardSection";
import VenueSection from "@/Layouts/Merchant/Sidenav/VenueSection";
import SidenavLink from "@/components/Common/SidenavLink";
import { Book } from "lucide-react";

export default function Sidenav({ className = "" }) {
    const { auth } = usePage().props;
    const user = auth?.staff || auth?.merchant;
    const role = auth?.staff ? "staff" : "merchant";

    const venues = auth?.merchant?.venues || [];
    const menuToggles = useToggleMap({
        dashboard: false,
        account: false,
        ...venues.reduce(
            (acc, v) => ({ ...acc, [`venue-${v.slug}`]: false }),
            {}
        ),
    });

    return (
        <aside className={`fixed top-0 left-0 h-[98vh] w-64 ${className}`}>
            <Card className="m-2 h-full rounded-lg shadow-none overflow-y-auto custom-scrollbar">
                <CardHeader className="pt-4 flex flex-row gap-2 items-center border-none">
                    <AppLogo
                        variant="logo"
                        className="w-10"
                        alt="ingkenefutsal"
                    />
                    <div className="flex flex-col font-medium text-sm">
                        <span className="mt-1">IngkeneFutsal Web</span>
                        <span>Magelang</span>
                    </div>
                </CardHeader>
                <CardBody>
                    <nav className="my-2">
                        <AccountSection
                            user={user}
                            role={role}
                            isOpen={menuToggles.isOpen("account")}
                            toggle={menuToggles.toggle}
                        />
                    </nav>

                    <nav className="my-4">
                        <DashboardSection
                            role={role}
                            isOpen={menuToggles.isOpen("dashboard")}
                            toggle={() => menuToggles.toggle("dashboard")}
                        />
                    </nav>

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light">
                                Staff
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                                <li>
                                    <SidenavLink
                                        href={route("merchant.staff.index")}
                                        routeName="merchant.staff.index"
                                        label="Semua Staff"
                                        icon={Book}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light">
                            VENUES
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("merchant.venues.index")}
                                    routeName="merchant.venues.index"
                                    label="Semua Venue"
                                    icon={Book}
                                />
                            </li>
                        </ul>

                        {venues.map((venue) => (
                            <VenueSection
                                key={venue.id}
                                venue={venue}
                                toggle={menuToggles.toggle}
                                isOpen={menuToggles.isOpen(
                                    `venue-${venue.slug}`
                                )}
                                toggleField={menuToggles.toggle}
                                fieldOpenMap={menuToggles.isOpen}
                            />
                        ))}
                    </nav>
                </CardBody>
            </Card>
        </aside>
    );
}
