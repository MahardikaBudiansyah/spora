// @/components/Orders/OrderVenueSummary
import { MapPin } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";

export default function MerchantOrderVenueSummary({ operators, venue }) {
    const addr = venue?.address;

    const fullAddress = addr
        ? `${addr.full_address}, ${addr.village}, ${addr.district}, ${addr.city}, ${addr.province}`
        : "-";

    const operatorNames =
        operators?.length > 0 ? operators.map((op) => op.name).join(", ") : "-";

    return (
        <ContentCard
            variant="elevated"
            title="Informasi Venue"
            icon={MapPin}
            className="shadow-none"
        >
            <div className="flex flex-col items-start text-left gap-4 ">
                {operators && (
                    <DescriptionItem label="Operator" value={operatorNames} />
                )}

                <DescriptionItem
                    label="Nama Venue"
                    value={venue?.name || "-"}
                />

                <DescriptionItem label="Alamat Venue" value={fullAddress} />
            </div>
        </ContentCard>
    );
}
