// @/components/Orders/OrderCustomerSummary
import { User } from "lucide-react";
import SummarySection from "@/components/cards/SummaryCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatTo08 } from "@/utils/numberPhone";

export default function OrderCustomerSummary({ customer }) {
    return (
        <SummarySection
            title="Informasi Konsumen"
            icon={<User className="w-4 h-4" />}
        >
            <div className="flex flex-col gap-4 items-start text-left">
                <DescriptionItem label="Nama" value={customer.name} />
                <DescriptionItem
                    label="WhatsApp"
                    value={formatTo08(customer.phone)}
                />
                <DescriptionItem
                    label="Email"
                    value={customer.email}
                    className="col-span-2"
                    valueClassName="break-all"
                />
            </div>
        </SummarySection>
    );
}
