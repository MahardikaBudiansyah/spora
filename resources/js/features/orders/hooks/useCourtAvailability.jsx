import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toISODate } from "@/utils/date";
import { toast } from "react-toastify";

export function useCourtAvailability(venue, selectedDate) {
    const [availabilityData, setAvailabilityData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAvailability = useCallback(
        async (isSilent = false, signal) => {
            if (!venue?.slug || !selectedDate) return;

            if (!isSilent) setLoading(true);

            try {
                const response = await axios.get(
                    route("venues.availability", { venue: venue.slug }),
                    {
                        params: { date: toISODate(selectedDate) },
                        signal: signal,
                    },
                );

                setAvailabilityData(response.data.courts || []);
            } catch (err) {
                if (axios.isCancel(err)) return;
                toast.error("Gagal mengambil ketersediaan slot.");
                console.error("Fetch Error:", err);
            } finally {
                if (!isSilent) setLoading(false);
            }
        },
        [venue?.slug, selectedDate],
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchAvailability(false, controller.signal);
        return () => controller.abort();
    }, [fetchAvailability]);

    return {
        availabilityData, // Ini berisi array courts
        loading,
        refresh: () => fetchAvailability(false),
    };
}
