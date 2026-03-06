import { User } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatTo08 } from "@/utils/numberPhone";

export default function MerchantOrderCustomerSummary({ customer }) {
    return (
        <ContentCard
            variant="elevated"
            title="Informasi Konsumen"
            icon={User}
            className="shadow-none"
        >
            <div className="flex flex-col gap-4 items-start text-left">
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full">
                    <DescriptionItem
                        label="No Handphone/ Whatsapp"
                        value={formatTo08(customer.phone)}
                    />
                    <DescriptionItem label="Nama" value={customer.name} />
                </div>
                <div className="flex flex-col xl:flex-row gap-4 w-full">
                    <DescriptionItem
                        label="Email"
                        value={customer.email || "-"}
                        valueClassName="break-all"
                    />
                    <DescriptionItem
                        label="Member"
                        value={customer.member_no || "-"}
                    />
                </div>
            </div>
        </ContentCard>
    );
}
