// contexts/CartContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
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

    // LocalStorage key per user
    const LOCAL_STORAGE_KEY = user
        ? `cart_selected_slots_${user.id}`
        : "cart_selected_slots_guest";

    const [selectedSlots, setSelectedSlots] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });

    const [selectedVenueId, setSelectedVenueId] = useState(null);

    // Sinkronisasi localStorage setiap perubahan selectedSlots
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(selectedSlots)
            );
        }
    }, [selectedSlots, LOCAL_STORAGE_KEY]);

    // Reset saat logout
    useEffect(() => {
        if (!authLoading && !authenticated) {
            setCarts([]);
            setSelectedSlots([]);
            setSelectedVenueId(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }, [authenticated, authLoading, LOCAL_STORAGE_KEY]);

    // Fetch carts dari API
    const fetchCarts = async () => {
        if (!authenticated || !user) {
            setCarts([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(route("user.cart.index"));
            setCarts(res.data.data);

            // Pertahankan checkbox yang masih ada di cart
            const cartSlotIds = res.data.data.flatMap((venue) =>
                venue.dates.flatMap((date) =>
                    date.fields.flatMap((field) =>
                        field.timeslots.map((slot) => slot.cart_id)
                    )
                )
            );

            setSelectedSlots((prev) =>
                prev.filter((id) => cartSlotIds.includes(id))
            );
        } catch (error) {
            console.error("Failed to fetch carts:", error);
            setCarts([]);
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch saat login / user berubah
    useEffect(() => {
        if (!authLoading && authenticated) fetchCarts();
    }, [authenticated, authLoading]);

    // Sinkronisasi cross-tab untuk selectedSlots
    useEffect(() => {
        const syncCart = (event) => {
            if (event.key === LOCAL_STORAGE_KEY) {
                setSelectedSlots(
                    event.newValue ? JSON.parse(event.newValue) : []
                );
            }
        };
        window.addEventListener("storage", syncCart);
        return () => window.removeEventListener("storage", syncCart);
    }, [LOCAL_STORAGE_KEY]);

    // Hitung total slot di carts
    const cartCount = useMemo(() => {
        return carts.reduce((total, v) => {
            v.dates.forEach((d) =>
                d.fields.forEach((f) => (total += f.timeslots.length))
            );
            return total;
        }, 0);
    }, [carts]);

    // Toggle slot select/deselect
    const toggleSlot = (slotId, venueId) => {
        if (selectedSlots.includes(slotId)) {
            const newSlots = selectedSlots.filter((id) => id !== slotId);
            setSelectedSlots(newSlots);
            if (newSlots.length === 0) setSelectedVenueId(null);
            return;
        }

        if (selectedVenueId && venueId !== selectedVenueId) {
            toast.info("Hanya bisa memilih slot dari satu venue saja.");
            return;
        }

        setSelectedSlots([...selectedSlots, slotId]);
        setSelectedVenueId(venueId);
    };

    // Tambah item ke carts
    const addToCart = async (item) => {
        if (!authenticated) {
            toast.warn("Silakan login terlebih dahulu.");
            return;
        }
        try {
            await axios.post(route("user.cart.store"), item);
            await fetchCarts();
            toast.success("Slot jam ditambahkan ke keranjang");
        } catch (error) {
            console.error("Gagal menambahkan slot jam ke keranjang:", error);
            throw error;
        }
    };

    // Hapus item dari carts
    const removeFromCart = async (cartId) => {
        if (!authenticated) return;
        try {
            await axios.delete(route("user.cart.destroy", cartId));

            setCarts((prev) =>
                prev
                    .map((venue) => ({
                        ...venue,
                        dates: venue.dates
                            .map((date) => ({
                                ...date,
                                fields: date.fields
                                    .map((field) => ({
                                        ...field,
                                        timeslots: field.timeslots.filter(
                                            (s) => s.cart_id !== cartId
                                        ),
                                    }))
                                    .filter(
                                        (field) => field.timeslots.length > 0
                                    ),
                            }))
                            .filter((date) => date.fields.length > 0),
                    }))
                    .filter((venue) => venue.dates.length > 0)
            );

            setSelectedSlots((prev) => {
                const filtered = prev.filter((id) => id !== cartId);
                if (filtered.length === 0) setSelectedVenueId(null);
                return filtered;
            });

            toast.success("Slot jam dihapus dari cart");
        } catch (error) {
            toast.error("Gagal menghapus slot jam");
            throw error;
        }
    };

    // Checkout venue
    const checkoutVenue = (venueId) => {
        const venue = carts.find((v) => v.venue.id === venueId);
        if (!venue) return;

        const venueSlots = [];
        venue.dates.forEach((d) =>
            d.fields.forEach((f) =>
                f.timeslots.forEach((s) => {
                    if (selectedSlots.includes(s.cart_id)) {
                        venueSlots.push(s.cart_id);
                    }
                })
            )
        );

        if (venueSlots.length === 0) {
            toast.warn("Pilih slot terlebih dahulu untuk venue ini.");
            return;
        }

        setSelectedVenueId(venueId);
        setSelectedSlots(venueSlots);

        router.get(route("user.booking.create"));
    };

    return (
        <CartContext.Provider
            value={{
                carts,
                setCarts,
                loading,
                fetchCarts,
                cartCount,
                toggleSlot,
                addToCart,
                removeFromCart,
                selectedSlots,
                setSelectedSlots,
                selectedVenueId,
                setSelectedVenueId,
                checkoutVenue,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
