import { router } from "@inertiajs/react";
import Button from "@/components/Common/Button";
import MembershipPackageCard from "./MembershipPackageCard";
import axios from "axios";
import { Settings } from "lucide-react";

export default function VenueMembershipPackage({
    packages = [],
    venue,
    selectedPackageId = null,
    onSelectPackage = null,
    mode = "user",
    showLabel = false,
    showSettings = false,
    expandedPackageIds = {},
    onTogglePackage = () => {},
}) {
    const getButtonText = () => {
        if (mode === "user") return "Beli";
        if (mode === "merchant-order") return "Pilih";
        return null;
    };

    const getGridClass = () => {
        if (mode === "merchant-order") {
            return "grid xl:grid-cols-1 2xl:grid-cols-2 gap-4 mt-4";
        }

        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2";
    };

    const handleBuy = async (pkg) => {
        if (mode === "merchant-order") {
            onSelectPackage?.(pkg);
            return;
        }
        try {
            await axios.post(route("user.memberships.selectPackages"), {
                package_id: pkg.id,
            });

            window.location.href = route("user.memberships.create");
        } catch (error) {
            console.error("Gagal memilih paket membership:", error);
        }
    };

    if (!packages.length) {
        return (
            <p className="text-sm text-gray-500">Belum ada paket membership.</p>
        );
    }

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex flex-row justify-between gap-2 items-center pb-2">
                    <div className="flex items-center justify-between md:mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                            Paket Membership
                        </h3>
                    </div>
                    {showSettings && (
                        <div className="flex gap-2">
                            <Button
                                variant="zinc"
                                size="xs"
                                onClick={() =>
                                    router.get(
                                        route(
                                            "merchant.venues.memberships.packages.index",
                                            {
                                                venue: venue.slug,
                                            }
                                        )
                                    )
                                }
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Settings className="w-4 h-4 block md:hidden" />
                                <span className="hidden md:block">
                                    Pengaturan
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <div className={getGridClass()}>
                {packages.map((pkg) => (
                    <MembershipPackageCard
                        key={pkg.id}
                        pkg={pkg}
                        onBuy={() => handleBuy(pkg)}
                        isSelected={selectedPackageId === pkg.id}
                        buttonText={getButtonText()}
                        isExpanded={!!expandedPackageIds[pkg.id]}
                        onToggleExpand={() => onTogglePackage(pkg.id)}
                    />
                ))}
            </div>
        </div>
    );
}
