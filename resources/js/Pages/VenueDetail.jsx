import { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import UserLayout from "@/Layouts/UserLayout";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import BannerSection from "@/components/common/BannerSection";
import { ChevronDown, ChevronUp } from "lucide-react";
import VenueGalleryImage from "@/Pages/User/Partials/VenueGalleryImage";
import Button from "@/components/common/Button";
import DatePicker from "@/components/user/DatePicker";
import Badge from "@/components/common/Badge";
import VenueInfo from "@/components/venue/VenueInfo";
import VenueFacility from "@/components/venue/VenueFacility";
import VenueAddress from "@/components/venue/VenueAddress";
import TimeSlotButton from "@/components/Common/TimeSlotButton";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import { parseDate, toISODate } from "@/utils/date"; // ✅ import utils

export default function VenueDetail({ venue }) {
    const { user } = useAuth();
    const { auth } = usePage().props;
    const { addToCart, cartItems } = useCart();
    const { openModal } = useAuthModal();
    const timetableRef = useRef(null);

    // ✅ State utama
    const [selectedDate, setSelectedDate] = useState(parseDate(new Date()));
    const [openFieldId, setOpenFieldId] = useState(null);
    const [timeslots, setTimeslots] = useState([]);

    // Toggle open/close jadwal per field
    const handleToggle = (fieldId) => {
        if (!selectedDate) return;
        setOpenFieldId(openFieldId === fieldId ? null : fieldId);
    };

    // Scroll ke timetable
    function handleScrollToTimetable() {
        timetableRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Ambil timeslots tiap kali selectedDate berubah
    useEffect(() => {
        if (!selectedDate) return;

        console.log("Fetching timeslots:", venue.slug, toISODate(selectedDate));

        axios
            .get(route("getTimeslotsByVenue", { venue: venue.slug }), {
                params: { date: toISODate(selectedDate) },
            })
            .then((res) => {
                console.log("API response:", res.data);
                setTimeslots(res.data.fields);
            })
            .catch((err) => console.error(err));
    }, [selectedDate]);

    // Tambah slot ke cart
    const handleAddToCart = async (field, slot) => {
        if (slot.status_label !== "Tersedia") {
            toast.warning("Slot ini tidak tersedia untuk dipesan.");
            return;
        }

        if (!auth.user) {
            toast.warning("Anda harus login dulu untuk menambahkan ke cart.");
            openModal("login");
            return;
        }

        try {
            await addToCart({
                venue_id: venue.id,
                field_id: field.id,
                time_slot_id: slot.timeslot_id,
                date: toISODate(selectedDate),
                total_price: slot.price,
            });
            toast.success("Berhasil ditambahkan ke cart");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan ke cart"
            );
        }
    };

    // Cek apakah slot sudah ada di cart
    function isSlotInCart(fieldId, timeslotId, date) {
        for (const venueGroup of cartItems) {
            for (const fieldGroup of venueGroup.fields) {
                if (fieldGroup.field.id !== fieldId) continue;
                for (const dateGroup of fieldGroup.dates) {
                    if (dateGroup.date !== date) continue;
                    for (const slot of dateGroup.timeslots) {
                        if (slot.timeSlot.id === timeslotId) return true;
                    }
                }
            }
        }
        return false;
    }

    return (
        <UserLayout>
            <Head title={venue.name} />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-gray-800 dark:text-white">
                {/* Gallery */}
                <VenueGalleryImage images={venue.images} />

                {/* Info dan Harga */}
                <div className="py-8 flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col flex-1 gap-2">
                        <VenueInfo
                            name={venue.name}
                            rating="4.8"
                            description={venue.description}
                            phone_number={venue.phone_number}
                        />
                        <VenueAddress address={venue.address} />
                    </div>
                    <div className="w-full md:w-3/12">
                        <div className="p-6 flex flex-col gap-3 bg-white dark:bg-secondary-800 rounded-md">
                            <div className="flex flex-col items-center lg:items-start">
                                <span>Mulai dari:</span>
                                <div>
                                    <NumericFormat
                                        displayType="text"
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="Rp "
                                        allowNegative={false}
                                        decimalScale={0}
                                        value={
                                            venue.min_price?.toLocaleString() ||
                                            "0"
                                        }
                                        className="text-2xl font-bold"
                                    />
                                    <span>/ sesi</span>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleScrollToTimetable}
                            >
                                Cek Ketersediaan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Fasilitas */}
                <div className="py-8 flex flex-col gap-2">
                    <span className="text-lg font-bold">Fasilitas:</span>
                    <VenueFacility facilities={venue.facilities} />
                </div>

                {/* Pilih Jadwal */}
                <div ref={timetableRef} className="py-8 flex flex-col gap-2">
                    <span className="text-lg font-bold">Pilih Jadwal:</span>
                    <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                    />
                </div>

                {/* Field & Timeslots */}
                <div className="p-4 flex flex-col">
                    {venue.fields.map((field) => {
                        const fieldTimeslots =
                            timeslots.find((f) => f.id === field.id)?.slots ||
                            [];

                        return (
                            <div
                                key={field.id}
                                className="my-6 flex flex-col md:flex-row gap-4"
                            >
                                <img
                                    src={field.image}
                                    alt={field.name}
                                    className="w-[400px] h-[200px] md:h-[260px] object-cover rounded-lg shadow-md"
                                />
                                <div className="flex flex-col flex-1 gap-4">
                                    <div className="flex flex-row gap-4 items-center">
                                        <span className="text-lg font-semibold">
                                            {field.name}
                                        </span>
                                        <Badge className="px-2 py-1 text-xs">
                                            {field.type}
                                        </Badge>
                                    </div>
                                    <div>{field.description}</div>
                                    <div>
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleToggle(field.id)
                                            }
                                            disabled={!selectedDate}
                                        >
                                            {fieldTimeslots.length} Jadwal
                                            Tersedia
                                            {openFieldId === field.id ? (
                                                <ChevronUp className="ml-2 h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="ml-2 h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                    {openFieldId === field.id && (
                                        <div className="my-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {fieldTimeslots.map((slot) => {
                                                const isSelected = isSlotInCart(
                                                    field.id,
                                                    slot.timeslot_id,
                                                    toISODate(selectedDate) // ✅ pakai utils
                                                );
                                                return (
                                                    <TimeSlotButton
                                                        key={slot.timeslot_id}
                                                        slot={{
                                                            time:
                                                                slot.name ?? "",
                                                            status: slot.status_label,
                                                            price: slot.price,
                                                        }}
                                                        selected={isSelected}
                                                        disabled={
                                                            isSelected ||
                                                            slot.status_label !==
                                                                "Tersedia"
                                                        }
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                field,
                                                                slot
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </UserLayout>
    );
}
