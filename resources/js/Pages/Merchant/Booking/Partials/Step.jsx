// StepFieldSelection.jsx
import { useState, useEffect, useRef } from "react";
import FieldSelection from "@/Pages/Merchant/Booking/Partials/FieldSelection";
import PreviewBooking from "@/Pages/Merchant/Booking/Partials/PreviewBooking";

export default function StepFieldSelection({
    venue,
    fields,
    bookingSelections = [],
    onChange,
}) {
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
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

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <FieldSelection
                venue={venue}
                fields={fields}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={setSelectedFieldId}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                bookingSelections={bookingSelections}
                onBookingChange={handleBookingChange}
            />
            <PreviewBooking
                bookingSelections={bookingSelections}
                fields={fields}
                onBookingChange={handleBookingChange}
            />
        </div>
    );
}
