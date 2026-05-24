import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import { Package } from "lucide-react";

import VenueMembershipPackage from "@/features/venues/components/VenueMembershipPackage";

export default function VenueMembershipPackageSummary({ merchant, venue }) {
    const [expandedPackageIds, setExpandedPackageIds] = useState({});

    const handleTogglePackage = (packageId) => {
        setExpandedPackageIds((prev) => ({
            ...prev,
            [packageId]: !prev[packageId],
        }));
    };

    return (
        <ContentCard
            variant="elevated"
            icon={Package}
            title={`Paket Membership`}
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            <VenueMembershipPackage
                venue={venue}
                packages={venue.membership_packages}
                mode="admin-verification"
                showLabel={false}
                showSettings={false}
                expandedPackageIds={expandedPackageIds}
                onTogglePackage={handleTogglePackage}
            />
        </ContentCard>
    );
}
