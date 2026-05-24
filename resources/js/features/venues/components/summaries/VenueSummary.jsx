import { useState } from "react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import { ShieldCheck, EyeOff, Eye, Copy, User, LandPlot } from "lucide-react";
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

export default function VenueSummary({
    merchant,
    venue,
    categories = [],
    social_media = [],
}) {
    console.log(venue);
    const latestStatus = venue?.latest_status;

    const statusVenue = getVenueStatus(
        venue?.status,
        latestStatus?.created_at,
        latestStatus,
    );
    const StatusIcon = statusVenue.icon;

    const shouldShowReason = latestStatus && !latestStatus.is_system_generated;

    const actionDisplay = (
        <div className="flex flex-row gap-2 items-center">
            <div>
                <Badge
                    color={statusVenue.color}
                    tooltip={statusVenue.timestamp || ""}
                    className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap "
                >
                    <StatusIcon
                        size={14}
                        className={
                            venue?.status === "rejected" ? "animate-pulse" : ""
                        }
                    />
                    <span
                        className={
                            venue?.status === "rejected" ? "animate-pulse" : ""
                        }
                    >
                        {statusVenue.label}
                    </span>
                </Badge>
            </div>
        </div>
    );

    return (
        <ContentCard
            variant="elevated"
            icon={LandPlot}
            title={`Informasi Venue`}
            action={actionDisplay}
            titleClassName="whitespace-nowrap"
            bodyClassName="flex-1 space-y-4"
            className="w-full"
        >
            {venue?.status === "pending" && shouldShowReason && (
                <BannerAlert
                    type="info"
                    showIcon={false}
                    title="Catatan Mitra:"
                    size="xs"
                    className="my-0 "
                >
                    <div className="space-x-2">
                        <span>{latestStatus?.reason}</span>
                        <span className="opacity-90 font-medium">
                            ({formatFullDateTime(latestStatus?.created_at)})
                        </span>
                    </div>
                </BannerAlert>
            )}
            {venue?.status === "approved" && statusVenue.changeByName && (
                <div className="flex justify-end">
                    <Badge color={statusVenue.color}>
                        Direview oleh: {statusVenue.changeByName || "System"}
                    </Badge>
                </div>
            )}
            {venue?.status === "rejected" && latestStatus?.reason && (
                <BannerAlert
                    type="error"
                    title={
                        <span>
                            Disetujui oleh:{" "}
                            {venue?.latest_status?.change_by_snapshot}
                        </span>
                    }
                    size="xs"
                    className="my-0"
                >
                    <div className="space-x-2">
                        <span>{venue?.latest_status?.reason}</span>
                        <span className="opacity-90 font-medium">
                            (
                            {formatFullDateTime(
                                venue?.latest_status?.created_at,
                            )}
                            )
                        </span>
                    </div>
                </BannerAlert>
            )}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full space-y-4">
                    <GalleryImage images={venue.images} pathKey="url" />
                </div>
                <div className="w-full space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        <DescriptionItem
                            label="Nama Venue"
                            className="space-y-0"
                        >
                            <span className="font-medium text-secondary-900 dark:text-white">
                                {venue?.name || "-"}
                            </span>
                        </DescriptionItem>
                        <DescriptionItem
                            label="No. Handphone Venue"
                            className="space-y-0"
                        >
                            <span className="font-medium text-secondary-900 dark:text-white">
                                {formatTo08(venue?.phone_number) || "-"}
                            </span>
                        </DescriptionItem>
                        <DescriptionItem
                            label="Kategori Venue"
                            className="space-y-0"
                        >
                            <div className="py-1 flex flex-wrap justify-start gap-2">
                                {categories.map((cat) => {
                                    const badgeAttr = getCategoryBadge(cat);
                                    return (
                                        <Badge
                                            key={cat.id}
                                            color={badgeAttr.color}
                                            className="text-xs px-2 py-0.5 rounded-md font-bold shadow-sm"
                                        >
                                            {badgeAttr.label}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </DescriptionItem>
                    </div>
                    <DescriptionItem label="Deskripsi" className="space-y-0">
                        <span className="font-medium text-secondary-900 dark:text-white">
                            {venue?.description || "-"}
                        </span>
                    </DescriptionItem>

                    <DescriptionItem label="Alamat Venue" className="space-y-1">
                        <div className="flex gap-2 items-center ">
                            <span className="text-xs">
                                {formatFullAddress(
                                    venue?.address?.full_address,
                                ) || "-"}
                            </span>
                            {venue?.address?.full_address && (
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                        copyToClipboard(
                                            venue.address?.full_address,
                                            "Alamat",
                                        )
                                    }
                                    tooltip="Salin Alamat"
                                >
                                    <Copy size={14} />
                                </Button>
                            )}
                        </div>
                    </DescriptionItem>

                    <DescriptionItem label="Sosial Media" className="space-y-0">
                        <div className="flex flex-wrap gap-3 py-2">
                            {social_media.map((social) => {
                                const attr = getSocialMediaAttribute(
                                    social.platform,
                                );
                                const Icon = attr.icon;

                                return (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                    >
                                        <Badge
                                            color={attr.color}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-md transition-all group-hover:opacity-80 group-hover:scale-105 cursor-pointer shadow-sm"
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="font-semibold">
                                                {social.username}
                                            </span>
                                        </Badge>
                                    </a>
                                );
                            })}
                        </div>
                    </DescriptionItem>
                    <DescriptionItem
                        label="Fasilitas Venue"
                        className="space-y-0"
                    >
                        {venue.facilities?.length > 0 && (
                            <VenueFacility
                                showLabel={false}
                                facilities={venue.facilities}
                                itemClassName="text-xs"
                                iconClassName="w-6 h-6"
                            />
                        )}
                    </DescriptionItem>
                </div>
            </div>
        </ContentCard>
    );
}
