// StepFieldSelection.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import FieldSelection from "@/Pages/Merchant/Booking/Partials/FieldSelection";
import BookingSummaryTable from "@/Pages/Merchant/Booking/Partials/BookingSummaryTable";
import PreviewBooking from "@/Pages/Merchant/Booking/Partials/PreviewBooking";
import { toISODate } from "@/utils/date";
import { toast } from "react-toastify";
import axios from "axios";

export default function StepFieldSelection({
    venue,
    fields,
    bookingSelections = [],
    onChange,
}) {
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeslots, setTimeslots] = useState([]);
    const hasAutoSelected = useRef(false);

    // Auto select first field
    useEffect(() => {
        if (!hasAutoSelected.current && fields?.length > 0) {
            setSelectedFieldId(fields[0].id);
            hasAutoSelected.current = true;
        }
    }, [fields]);

    const handleBookingChange = (newSelections) => {
        const resolved =
            typeof newSelections === "function"
                ? newSelections(bookingSelections)
                : newSelections;
        onChange?.(resolved);
    };

    const fetchTimeslots = useCallback(() => {
        if (!venue?.slug || !selectedDate || !selectedFieldId) return;

        setLoading(true);
        const source = axios.CancelToken.source();

        axios
            .get(
                route("merchant.venues.bookings.getTimeslotsByVenue", {
                    venue: venue.slug,
                }),
                {
                    params: {
                        date: toISODate(selectedDate),
                    },
                    cancelToken: source.token,
                }
            )
            .then((res) => {
                // ambil field yang sesuai selectedFieldId
                const field = res.data.fields.find(
                    (f) => f.id === selectedFieldId
                );
                setTimeslots(field?.slots ?? []);
            })
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    toast.error(
                        "Gagal mengambil data slot jadwal. Silakan coba lagi."
                    );
                }
            })
            .finally(() => setLoading(false));

        return () => source.cancel();
    }, [venue?.slug, selectedDate, selectedFieldId]);

    // Auto fetch ketika dep berubah
    useEffect(() => {
        const cancel = fetchTimeslots();
        return cancel;
    }, [fetchTimeslots]);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <FieldSelection
                venue={venue}
                fields={fields}
                timeslots={timeslots}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={setSelectedFieldId}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                bookingSelections={bookingSelections}
                onBookingChange={handleBookingChange}
                loading={loading}
                onReload={fetchTimeslots} // 👈 tombol "refresh"
            />

            {/* Ganti PreviewBooking dengan BookingSummaryTable */}
            {/* <BookingSummaryTable bookingSelections={bookingSelections} /> */}
            <PreviewBooking
                bookingSelections={bookingSelections}
                fields={fields}
                onBookingChange={onChange}
            />
        </div>
    );
}
