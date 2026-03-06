import { useState, useMemo } from "react";
import { formatFullDateWithDay, parseDate } from "@/utils/date";
import VenueMembershipPackage from "@/features/venues/components/VenueMembershipPackage";
import DatePickerInput from "@/components/Common/DatePickerInput";
import PreviewOrderMembershipPackage from "@/features/orders/components/summaries/MerchantPreviewOrderMembershipPackage";
import ContentCard from "@/components/cards/ContentCard";
import BannerAlert from "@/components/Common/BannerAlert";
import SelectInput from "@/components/Common/SelectInput";
import LabelInput from "@/components/Common/LabelInput";
import ErrorInput from "@/components/Common/ErrorInput";
import { Info } from "lucide-react";

export default function StepMembershipPackageSelection({
    venue,
    venueOptions = [],
    membershipPackages = [],
    membershipPackageSelection,
    onSelectPackage,
    onChangeVenue,
    onChangeDate,
    isDateConflict,
    errors,
}) {
    const [expandedPackageIds, setExpandedPackageIds] = useState({});

    const handleTogglePackage = (packageId) => {
        setExpandedPackageIds((prev) => ({
            ...prev,
            [packageId]: !prev[packageId],
        }));
    };

    const selectedPackage = membershipPackageSelection?.package;
    const selectedDate = membershipPackageSelection?.start_date;

    const selectedDateFormatted = useMemo(
        () =>
            selectedDate
                ? formatFullDateWithDay(selectedDate)
                : "Belum memilih tanggal",
        [selectedDate],
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <ContentCard
                title={
                    membershipPackageSelection?.venue_name
                        ? `Paket Membership ${membershipPackageSelection.venue_name}`
                        : "Paket Membership"
                }
                icon={Info}
                className="shadow-none md:w-4/6 overflow-visible"
            >
                {venueOptions.length > 0 && (
                    <div className="w-full space-y-2 pb-8 border-b border-secondary-100 dark:border-secondary-800 text-left">
                        <LabelInput htmlFor="venue_id" value="Pilih Venue:" />
                        <SelectInput
                            id="venue_id"
                            value={membershipPackageSelection?.venue_id}
                            options={venueOptions}
                            onChange={onChangeVenue}
                            isSearchable={false}
                            placeholder="Pilih Venue..."
                        />
                        {errors?.venue_id && (
                            <ErrorInput
                                message={errors.venue_id}
                                className="mt-1"
                            />
                        )}
                    </div>
                )}

                {/* 2. Daftar Paket */}
                {!membershipPackageSelection?.venue_id ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl border-secondary-200 dark:border-secondary-700">
                        <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                            <Info className="w-6 h-6 text-secondary-300 dark:text-secondary-400" />
                        </div>
                        <div className="py-4 font-bold text-secondary-400 dark:text-secondary-500 text-xs">
                            <p>Silakan pilih venue terlebih dahulu.</p>
                        </div>
                    </div>
                ) : membershipPackages.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl border-secondary-200 dark:border-secondary-700">
                        <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                            <Info className="w-6 h-6 text-secondary-300 dark:text-secondary-400" />
                        </div>
                        <div className="py-4 font-bold text-secondary-400 dark:text-secondary-500 text-xs">
                            <p>Tidak Ada Paket Tersedia.</p>
                            <p>Venue ini belum memiliki paket aktif.</p>
                        </div>
                    </div>
                ) : (
                    <VenueMembershipPackage
                        packages={membershipPackages}
                        mode="merchant-order"
                        selectedPackageId={selectedPackage?.id}
                        onSelectPackage={onSelectPackage}
                        expandedPackageIds={expandedPackageIds}
                        onTogglePackage={handleTogglePackage}
                    />
                )}

                {selectedPackage && (
                    <div className="py-6 mt-6 border-t border-secondary-100 dark:border-secondary-800 transition-all duration-300">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label className="block font-bold text-secondary-700 dark:text-secondary-200 mb-1">
                                    Tanggal Mulai Aktif
                                </label>
                                <p className="text-xs text-secondary-500">
                                    Kapan kartu member ini mulai bisa digunakan?
                                </p>
                            </div>

                            {isDateConflict && (
                                <BannerAlert
                                    type="error"
                                    title="Jadwal Bentrok"
                                    showIcon={false}
                                    className="text-left"
                                >
                                    <p className="text-xs">
                                        Bentrok dengan paket aktif sampai{" "}
                                        <strong>
                                            {membershipPackageSelection.active_until_label ||
                                                "tanggal tertentu"}
                                        </strong>
                                        .
                                    </p>
                                </BannerAlert>
                            )}

                            <div className="w-full flex flex-col md:flex-row gap-3 md:items-center">
                                <div className="flex-1">
                                    <DatePickerInput
                                        value={
                                            selectedDate
                                                ? parseDate(
                                                      selectedDate,
                                                  ).toJSDate()
                                                : null
                                        }
                                        onChange={onChangeDate}
                                        placeholder="Pilih Tanggal Mulai"
                                    />
                                </div>
                                {selectedDate && (
                                    <div className="text-sm text-primary-600 font-semibold px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                        Terpilih: {selectedDateFormatted}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </ContentCard>

            <div className="md:w-2/6">
                <div className="lg:sticky lg:top-6">
                    <PreviewOrderMembershipPackage
                        venue={venue}
                        membershipPackage={selectedPackage}
                        startDate={selectedDate}
                        externalEndDate={membershipPackageSelection?.end_date}
                    />
                </div>
            </div>
        </div>
    );
}
