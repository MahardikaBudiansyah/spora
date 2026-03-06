import { useState, useEffect, useMemo } from "react";
import CourtSelection from "@/features/orders/components/forms/CourtSelection";
import MerchantPreviewBooking from "@/features/orders/components/summaries/MerchantPreviewBooking";
import ContentCard from "@/components/cards/ContentCard";
import LabelInput from "@/components/Common/LabelInput";
import SelectInput from "@/components/Common/SelectInput";
import ErrorInput from "@/components/Common/ErrorInput";
import { Info } from "lucide-react";
import { useVenueCourtAvailability } from "@/features/orders/hooks/useVenueCourtAvailability";
import ConfirmModal from "@/components/Common/ConfirmModal";

export default function StepCourtSelection({
    venue,
    venueOptions = [],
    courts,
    bookingSelections = [],
    onChangeVenue,
    onChange,
    errors,
    venue_id,
}) {
    const [selectedCourtId, setSelectedCourtId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingVenueId, setPendingVenueId] = useState(null);

    const { availabilityData, loading, refresh } = useVenueCourtAvailability(
        venue,
        selectedDate,
    );

    const currentCourts = useMemo(() => {
        const source = availabilityData || courts;
        return Array.isArray(source?.data)
            ? source.data
            : Array.isArray(source)
              ? source
              : [];
    }, [availabilityData, courts]);

    useEffect(() => {
        if (loading || currentCourts.length === 0) return;

        const stillExists = currentCourts.find((c) => c.id === selectedCourtId);

        if (!stillExists) {
            setSelectedCourtId(currentCourts[0].id);
        }
    }, [currentCourts, loading, selectedCourtId]);

    useEffect(() => {
        setSelectedCourtId(null);
    }, [venue_id]);

    const handleVenueChangeAttempt = (newVenueId) => {
        if (newVenueId === venue_id) return;

        if (bookingSelections.length === 0) {
            onChangeVenue(newVenueId, venueOptions);
            return;
        }

        setPendingVenueId(newVenueId);
        setShowConfirm(true);
    };

    const confirmVenueChange = () => {
        onChangeVenue(pendingVenueId, venueOptions);
        setShowConfirm(false);
        setPendingVenueId(null);
        setSelectedCourtId(null);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <ContentCard
                title="Pilih Jadwal Lapangan"
                icon={Info}
                className="shadow-none w-full overflow-visible text-left h-fit"
            >
                {venueOptions.length > 0 && (
                    <div className="w-full space-y-2 pb-8 border-b border-secondary-100 dark:border-secondary-800">
                        <LabelInput htmlFor="venue_id" value="Pilih Venue:" />
                        <SelectInput
                            id="venue_id"
                            value={venue_id}
                            options={venueOptions}
                            onChange={(val) => handleVenueChangeAttempt(val)}
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

                {venue ? (
                    <CourtSelection
                        courts={currentCourts}
                        selectedCourtId={selectedCourtId}
                        setSelectedCourtId={setSelectedCourtId}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        bookingSelections={bookingSelections}
                        onBookingChange={onChange}
                        loading={loading}
                        onReload={refresh}
                        errors={errors}
                    />
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl border-secondary-200 dark:border-secondary-700">
                        <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                            <Info className="w-6 h-6 text-secondary-300 dark:text-secondary-400" />
                        </div>
                        <div className="py-4 font-bold text-secondary-400 dark:text-secondary-500 text-xs">
                            <p>Silakan pilih venue terlebih dahulu.</p>
                        </div>
                    </div>
                )}
            </ContentCard>

            <div className="w-full">
                <div className="lg:sticky lg:top-6">
                    <MerchantPreviewBooking
                        variant="plain"
                        venue={venue}
                        bookingSelections={bookingSelections}
                        onBookingChange={onChange}
                    />
                </div>
            </div>

            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmVenueChange}
                title="Ganti Venue?"
                description="Mengganti venue akan menghapus semua jadwal lapangan yang sudah Anda pilih sebelumnya. Apakah Anda yakin?"
                confirmText="Ya, Reset dan Ganti"
                cancelText="Batalkan"
            />
        </div>
    );
}
