import { router } from "@inertiajs/react";
import Button from "@/components/Common/Button";
import MembershipPackageCard from "@/features/venues/components/MembershipPackageCard";
import axios from "axios";
import { Settings } from "lucide-react";
import { toast } from "react-toastify";

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
    authenticated = false,
    openModal = () => {},
}) {
    const getButtonText = () => {
        if (mode === "user") return "Beli";
        if (mode === "merchant-order") return "Pilih";
        return null;
    };

    const getGridClass = () => {
        if (mode === "merchant-order") {
            return "grid grid-cols-1 2xl:grid-cols-2 gap-4";
        }

        if (mode === "admin-verification") {
            return "grid grid-cols-1 2xl:grid-cols-2 gap-4";
        }

        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2";
    };

    const handleBuy = async (pkg) => {
        if (mode === "merchant-order") {
            onSelectPackage?.(pkg);
            return;
        }

        if (!authenticated) {
            toast.warning(
                "Anda harus login dulu untuk membeli paket membership.",
            );
            openModal("login");
            return;
        }

        router.post(
            route("user.memberships.selectPackages"),
            { package_id: pkg.id },
            {
                onStart: () => {},
                onError: (errors) => {
                    toast.error("Gagal memilih paket. Silakan coba lagi.");
                    console.error(errors);
                },
            },
        );
    };

    if (!packages.length) {
        return (
            <p className="text-sm text-center text-secondary-500">
                Belum ada paket membership.
            </p>
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
                                            },
                                        ),
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
