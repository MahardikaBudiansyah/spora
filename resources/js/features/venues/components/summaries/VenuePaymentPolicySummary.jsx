import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import {
    ShieldCheck,
    EyeOff,
    Eye,
    Copy,
    User,
    LandPlot,
    Banknote,
} from "lucide-react";
import DescriptionItem from "@/components/Common/DescriptionItem";
import Badge from "@/components/Common/Badge";
import { getProfileVerificationStatus } from "@/utils/attributes/merchantAttribute";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatTo08 } from "@/utils/numberPhone";
import { formatBusinessType } from "@/utils/businessType";
import { formatFullAddress } from "@/utils/address";
import { router } from "@inertiajs/react";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { formatFullDateTime } from "@/utils/date";
import {
    getCategoryBadge,
    getVenueStatus,
} from "@/utils/attributes/venueAttribute";
import VenueFacility from "@/components/Venues/VenueFacility";
import GalleryImage from "@/components/Common/GalleryImage";
import VenuePaymentInfo from "@/components/Venues/VenuePaymentInfo";

export default function VenuePaymentPolicySummary({ merchant, venue }) {
    return (
        <ContentCard
            variant="elevated"
            icon={Banknote}
            title={`Kebijakan Pembayaran`}
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            <VenuePaymentInfo
                paymentPolicies={venue.payment_policies}
                venueSlug={venue.slug}
            />
        </ContentCard>
    );
}
