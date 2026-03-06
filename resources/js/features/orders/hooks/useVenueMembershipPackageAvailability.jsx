import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useVenueMembershipPackageAvailability = (venueId) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPackages = useCallback(async (id, signal) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.get(
                route("merchant.memberships.orders.getPackages"),
                {
                    params: { venue_id: id },
                    signal,
                },
            );
            setPackages(res.data.data || res.data);
        } catch (err) {
            if (!axios.isCancel(err)) toast.error("Gagal memuat paket");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchPackages(venueId, controller.signal);
        return () => controller.abort();
    }, [venueId, fetchPackages]);

    return { packages, loading };
};
