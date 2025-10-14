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
const LOCAL_STORAGE_KEY = "cart_selected_slots";

export function CartProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false);

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
    }, [selectedSlots]);

    // Reset saat logout
    useEffect(() => {
        if (!authLoading && !user) {
            setCarts([]);
            setSelectedSlots([]);
            setSelectedVenueId(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }, [user, authLoading]);

    // Fetch carts dari API
    const fetchCarts = async () => {
        if (!user) {
            setCarts([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(route("user.cart.index"));
            setCarts(res.data.data);

            // Pertahankan checkbox yang sudah ada di localStorage
            const cartSlotIds = res.data.data.flatMap((venue) =>
                venue.dates.flatMap((date) =>
                    date.fields.flatMap((field) =>
                        field.timeslots.map((slot) => slot.cart_id)
                    )
                )
            );

            setSelectedSlots((prev) => {
                // Hanya pertahankan slot yang masih ada di cart
                const filteredPrev = prev.filter((id) =>
                    cartSlotIds.includes(id)
                );
                return filteredPrev;
            });
        } catch (error) {
            console.error("Failed to fetch carts:", error);
            setCarts([]);
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch saat login
    useEffect(() => {
        if (!authLoading && user) fetchCarts();
    }, [user, authLoading]);

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
        // Jika slot sudah dipilih → hapus langsung
        if (selectedSlots.includes(slotId)) {
            const newSlots = selectedSlots.filter((id) => id !== slotId);
            setSelectedSlots(newSlots);

            // reset venue jika tidak ada slot tersisa
            if (newSlots.length === 0) setSelectedVenueId(null);

            return;
        }

        // jika slot baru, tapi venue berbeda
        if (selectedVenueId && venueId !== selectedVenueId) {
            toast.info("Hanya bisa memilih slot dari satu venue saja.");
            return;
        }

        // tambah slot baru
        setSelectedSlots([...selectedSlots, slotId]);
        setSelectedVenueId(venueId);
    };

    // Tambah item ke carts (tidak otomatis dicentang)
    const addToCart = async (item) => {
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
        try {
            await axios.delete(route("user.cart.destroy", cartId));

            setCarts((prev) => {
                // 1. Hapus slot dari setiap field
                const updatedCarts = prev
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
                                    // 2. Hapus field jika tidak ada slot
                                    .filter(
                                        (field) => field.timeslots.length > 0
                                    ),
                            }))
                            // 3. Hapus date jika semua field kosong
                            .filter((date) => date.fields.length > 0),
                    }))
                    // 4. Hapus venue jika semua date kosong
                    .filter((venue) => venue.dates.length > 0);

                return updatedCarts;
            });

            // Hapus dari selectedSlots
            setSelectedSlots((prev) => {
                const filtered = prev.filter((id) => id !== cartId);
                if (filtered.length === 0) setSelectedVenueId(null);
                return filtered;
            });

            toast.success("Slot dajm dihapus dari carts");
        } catch (error) {
            toast.error("Gagal menghapus slot dajm");
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

        // Update context
        setSelectedVenueId(venueId);
        setSelectedSlots(venueSlots);

        // URL clean → tidak perlu param panjang
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
