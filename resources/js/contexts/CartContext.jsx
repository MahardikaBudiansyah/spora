import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { router } from "@inertiajs/react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user, authenticated, loading: authLoading } = useAuth();
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const LOCAL_STORAGE_KEY = useMemo(() => {
        return user
            ? `cart_selected_slots_${user.id}`
            : "cart_selected_slots_guest";
    }, [user]);

    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedVenueId, setSelectedVenueId] = useState(null);

    console.log("carts: ", carts);

    useEffect(() => {
        const savedSlots = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedVenue = localStorage.getItem(`${LOCAL_STORAGE_KEY}_venue`);

        if (savedSlots) {
            try {
                setSelectedSlots(JSON.parse(savedSlots));
            } catch (e) {
                setSelectedSlots([]);
            }
        } else {
            setSelectedSlots([]);
        }

        if (savedVenue) {
            try {
                setSelectedVenueId(JSON.parse(savedVenue));
            } catch (e) {
                setSelectedVenueId(null);
            }
        } else {
            setSelectedVenueId(null);
        }

        setIsReady(true);
    }, [LOCAL_STORAGE_KEY]);

    useEffect(() => {
        if (selectedSlots.length > 0 && carts.length > 0) {
            let detectedVenueId = null;

            for (const venue of carts) {
                for (const date of venue.dates) {
                    for (const court of date.courts) {
                        for (const slot of court.timeSlots) {
                            if (selectedSlots.includes(slot.cart_id)) {
                                detectedVenueId = venue.venue.id;
                                break;
                            }
                        }
                    }
                }
            }

            if (detectedVenueId && detectedVenueId !== selectedVenueId) {
                setSelectedVenueId(detectedVenueId);
            }
        }
    }, [selectedSlots, carts]);

    useEffect(() => {
        if (isReady) {
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(selectedSlots),
            );
            localStorage.setItem(
                `${LOCAL_STORAGE_KEY}_venue`,
                JSON.stringify(selectedVenueId),
            );
        }
    }, [selectedSlots, selectedVenueId, LOCAL_STORAGE_KEY, isReady]);

    const sortedCarts = useMemo(() => {
        return carts.map((venue) => ({
            ...venue,
            dates: [...(venue.dates || [])]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((date) => ({
                    ...date,
                    courts: date.courts.map((court) => ({
                        ...court,
                        timeSlots: [...court.timeSlots].sort((a, b) =>
                            a.start_time.localeCompare(b.start_time),
                        ),
                    })),
                })),
        }));
    }, [carts]);

    const fetchCarts = useCallback(async () => {
        if (!authenticated || !user) return;

        setLoading(true);
        try {
            const res = await axios.get(route("user.cart.index"));
            const data = res.data.data || [];
            setCarts(data);

            const allAvailableCartIds = [];
            data.forEach((v) =>
                v.dates?.forEach((d) =>
                    d.courts?.forEach((c) =>
                        c.timeSlots?.forEach((s) =>
                            allAvailableCartIds.push(s.cart_id),
                        ),
                    ),
                ),
            );

            setSelectedSlots((prev) =>
                prev.filter((id) => allAvailableCartIds.includes(id)),
            );
            // ---------------------------
        } catch (error) {
            console.error("Gagal mengambil data keranjang:", error);
        } finally {
            setLoading(false);
        }
    }, [authenticated, user]);
    useEffect(() => {
        if (!authLoading && authenticated) fetchCarts();
    }, [authenticated, authLoading, fetchCarts]);

    useEffect(() => {
        if (!authLoading && !authenticated) {
            setCarts([]);
            setSelectedSlots([]);
            setSelectedVenueId(null);
        }
    }, [authenticated, authLoading]);

    useEffect(() => {
        const syncOnStorageChange = (e) => {
            if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
                setSelectedSlots(JSON.parse(e.newValue));
            }
            if (e.key === `${LOCAL_STORAGE_KEY}_venue` && e.newValue) {
                setSelectedVenueId(JSON.parse(e.newValue));
            }
        };
        window.addEventListener("storage", syncOnStorageChange);
        return () => window.removeEventListener("storage", syncOnStorageChange);
    }, [LOCAL_STORAGE_KEY]);

    const cartCount = useMemo(() => {
        return carts.reduce((total, v) => {
            v.dates?.forEach((d) =>
                d.courts?.forEach((f) => {
                    total += f.timeSlots?.length || 0;
                }),
            );
            return total;
        }, 0);
    }, [carts]);

    const toggleSlot = (slotId, venueId) => {
        setSelectedSlots((prev) => {
            const isSelected = prev.includes(slotId);

            if (isSelected) {
                const updated = prev.filter((id) => id !== slotId);
                if (updated.length === 0) setSelectedVenueId(null);
                return updated;
            } else {
                if (selectedVenueId && venueId !== selectedVenueId) {
                    toast.info(
                        "Anda hanya bisa memilih slot dari satu venue yang sama.",
                    );
                    return prev;
                }
                setSelectedVenueId(venueId);
                return [...prev, slotId];
            }
        });
    };

    const addToCart = async (item) => {
        if (!authenticated) {
            toast.warn("Silakan login terlebih dahulu.");
            return;
        }
        try {
            await axios.post(route("user.cart.store"), item);
            await fetchCarts();
            toast.success("Slot ditambahkan ke keranjang");
        } catch (error) {
            toast.error("Gagal menambahkan ke keranjang");
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(route("user.cart.destroy", cartId));

            fetchCarts();

            setSelectedSlots((prev) => {
                const updated = prev.filter((id) => id !== cartId);
                if (updated.length === 0) setSelectedVenueId(null);
                return updated;
            });

            toast.success("Slot dihapus");
        } catch (error) {
            toast.error("Gagal menghapus slot");
        }
    };

    const checkoutVenue = (venueId) => {
        const currentVenue = carts.find((v) => v.venue.id === venueId);
        if (!currentVenue) return;

        const validIds = [];
        currentVenue.dates.forEach((d) =>
            d.courts.forEach((c) =>
                c.timeSlots.forEach((s) => {
                    if (selectedSlots.includes(s.cart_id))
                        validIds.push(s.cart_id);
                }),
            ),
        );

        if (validIds.length === 0) {
            toast.warn("Pilih minimal satu slot.");
            return;
        }

        router.post(route("user.bookings.prepareCheckout"), {
            venue_id: venueId,
            ids: validIds,
        });
    };

    return (
        <CartContext.Provider
            value={{
                carts: sortedCarts,
                loading,
                fetchCarts,
                cartCount,
                toggleSlot,
                addToCart,
                removeFromCart,
                selectedSlots,
                selectedVenueId,
                checkoutVenue,
                isReady,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
