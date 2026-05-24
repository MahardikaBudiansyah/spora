import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toISODate } from "@/utils/date";
import { toast } from "react-toastify";

export function useVenueCourtAvailability(venue, selectedDate) {
    const [availabilityData, setAvailabilityData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAvailability = useCallback(
        async (isSilent = false, signal) => {
            if (!venue?.slug || !selectedDate) return;

            if (!isSilent) setLoading(true);

            try {
                const response = await axios.get(
                    route("merchant.venues.bookings.getTimeslotsByVenue", {
                        venue: venue.slug,
                    }),
                    {
                        params: { date: toISODate(selectedDate) },
                        signal: signal,
                    },
                );

                // console.log("Full API Response:", response.data);

                // const courts = response.data.courts || [];
                // const debug = response.data.debug_info;

                // if (debug) {
                //     console.group("🖥️ Backend Debug Info");
                //     console.log("Tanggal di Query:", debug.request_date);
                //     console.log(
                //         "Jumlah Jadwal Ditemukan:",
                //         debug.schedules_count,
                //     );
                //     console.groupEnd();
                // }

                setAvailabilityData(response.data.courts || null);
            } catch (err) {
                if (axios.isCancel(err)) return;
                toast.error("Gagal mengambil data ketersediaan.");
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

        return () => {
            controller.abort();
        };
    }, [fetchAvailability]);

    return {
        availabilityData,
        loading,
        refresh: () => fetchAvailability(false),
    };
}
