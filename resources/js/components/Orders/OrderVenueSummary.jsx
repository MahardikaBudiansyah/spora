// @/components/Orders/OrderVenueSummary
import { MapPin } from "lucide-react";
import SummarySection from "@/components/cards/SummaryCard";
import DescriptionItem from "@/components/Common/DescriptionItem";

export default function OrderVenueSummary({ operators, venue }) {
    // Helper untuk format alamat
    const fullAddress = venue?.addresses?.[0]
        ? `${venue.addresses[0].address}, ${venue.addresses[0].city_name}`
        : "-";

    // Helper untuk list operator
    const operatorNames =
        operators?.length > 0 ? operators.map((op) => op.name).join(", ") : "-";

    return (
        <SummarySection
            title="Informasi Venue"
            icon={<MapPin className="w-4 h-4" />}
        >
            <div className="flex flex-col items-start text-left gap-4">
                {/* Tampilkan operator hanya jika ada datanya */}
                {operators && (
                    <DescriptionItem label="Operator" value={operatorNames} />
                )}

                <DescriptionItem
                    label="Nama Venue"
                    value={venue?.name || "-"}
                />

                <DescriptionItem label="Alamat Venue" value={fullAddress} />
            </div>
        </SummarySection>
    );
}
