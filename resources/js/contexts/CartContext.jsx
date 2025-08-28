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

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedVenueId, setSelectedVenueId] = useState(null);

    // Load dari localStorage
    useEffect(() => {
        const savedSlots = localStorage.getItem("selectedSlots");
        const savedVenueId = localStorage.getItem("selectedVenueId");

        if (savedSlots) setSelectedSlots(JSON.parse(savedSlots));
        if (savedVenueId) setSelectedVenueId(Number(savedVenueId));
    }, []);

    // Simpan ke localStorage setiap kali berubah
    useEffect(() => {
        if (selectedSlots.length > 0) {
            localStorage.setItem(
                "selectedSlots",
                JSON.stringify(selectedSlots)
            );
        } else {
            localStorage.removeItem("selectedSlots");
        }
    }, [selectedSlots]);

    useEffect(() => {
        if (selectedVenueId !== null) {
            localStorage.setItem("selectedVenueId", selectedVenueId);
        } else {
            localStorage.removeItem("selectedVenueId");
        }
    }, [selectedVenueId]);

    // Sync antar tab
    useEffect(() => {
        const syncSlots = (e) => {
            if (e.key === "selectedSlots") {
                setSelectedSlots(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === "selectedSlots" || e.key === "selectedVenueId") {
                fetchCartItems();
            }
            if (e.key === "selectedVenueId") {
                setSelectedVenueId(e.newValue ? Number(e.newValue) : null);
            }
        };
        window.addEventListener("storage", syncSlots);
        return () => window.removeEventListener("storage", syncSlots);
    }, []);

    // Reset kalau user logout
    useEffect(() => {
        if (!authLoading && !user) {
            setSelectedSlots([]);
            setSelectedVenueId(null);
            localStorage.removeItem("selectedSlots");
            localStorage.removeItem("selectedVenueId");
        }
    }, [user, authLoading]);

    const fetchCartItems = () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        axios
            .get(route("user.cart.index"))
            .then((res) => setCartItems(res.data.data))
            .catch(() => setCartItems([]))
            .finally(() => setLoading(false));
    };

    const cartCount = useMemo(() => {
        let totalCount = 0;
        cartItems.forEach((venueGroup) => {
            venueGroup.fields.forEach((fieldGroup) => {
                fieldGroup.dates.forEach((dateGroup) => {
                    totalCount += dateGroup.timeslots.length;
                });
            });
        });
        return totalCount;
    }, [cartItems]);

    const toggleSlot = (slotId, venueId) => {
        // Kalau belum ada venue yang dipilih, set venue yang baru
        if (!selectedVenueId) {
            setSelectedVenueId(venueId);
            setSelectedSlots([slotId]);
            return;
        }

        // Kalau slot dari venue lain, jangan di-allow select (atau bisa kasih toast peringatan)
        if (venueId !== selectedVenueId) {
            toast.info("Hanya bisa memilih slot dari satu venue saja.");
            return;
        }

        // Toggle slot di venue yang sama
        setSelectedSlots((prev) =>
            prev.includes(slotId)
                ? prev.filter((id) => id !== slotId)
                : [...prev, slotId]
        );

        // Kalau setelah toggle jadi kosong, reset selectedVenueId
        if (selectedSlots.length === 1 && selectedSlots.includes(slotId)) {
            setSelectedVenueId(null);
        }
    };

    const addToCart = async (item) => {
        try {
            await axios.post(route("user.cart.store"), item);
            await fetchCartItems();
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    };

    const removeItem = async (cartId) => {
        try {
            await axios.delete(route("user.cart.destroy", cartId));
            await fetchCartItems();
            setSelectedSlots([]);
            setSelectedVenueId(null);
            toast.success("Item dihapus dari cart");
        } catch (error) {
            toast.error("Gagal menghapus item");
            throw error;
        }
    };

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user]);

    const checkoutVenue = (venueId) => {
        const venueSlots = [];

        const venueGroup = cartItems.find((v) => v.venue.id === venueId);
        if (!venueGroup) return;

        venueGroup.fields.forEach((fieldGroup) => {
            fieldGroup.dates.forEach((dateGroup) => {
                dateGroup.timeslots.forEach((slot) => {
                    if (selectedSlots.includes(slot.id)) {
                        venueSlots.push(slot.id);
                    }
                });
            });
        });

        if (venueSlots.length === 0) {
            toast.warn("Pilih slot terlebih dahulu untuk venue ini.");
            return;
        }

        axios
            .post(route("user.cart.checkout"), {
                venue_id: venueId,
                slot_ids: venueSlots,
            })
            .then((res) => {
                toast.success(res.data.message);
                fetchCartItems();
                setSelectedSlots((prev) =>
                    prev.filter((id) => !venueSlots.includes(id))
                );
                // Jika sudah checkout semua slot venue ini, reset venueId
                setSelectedVenueId(null);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Checkout gagal");
            });
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                fetchCartItems,
                cartCount,
                toggleSlot,
                addToCart,
                removeItem,
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
