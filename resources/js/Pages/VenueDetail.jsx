import { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import UserLayout from "@/Layouts/UserLayout";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import BannerSection from "@/components/common/BannerSection";
import { ChevronDown, Star, ChevronUp } from "lucide-react";
import VenueGalleryImage from "@/Pages/User/Partials/VenueGalleryImage";
import Button from "@/components/common/Button";
import DatePicker from "@/components/user/DatePicker";
import Badge from "@/components/common/Badge";
import VenueInfo from "@/components/venue/VenueInfo";
import VenueFacility from "@/components/venue/VenueFacility";
import VenueLocation from "@/components/venue/VenueLocation";
import TimeSlotButton from "@/components/Common/TimeSlotButton";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";

export default function Venue({ venue }) {
    const { user } = useAuth();
    const role = user?.role ?? "guest";
    const { auth } = usePage().props;

    const { addToCart, cartItems } = useCart();
    const { openModal } = useAuthModal();
    const timetableRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openFieldId, setOpenFieldId] = useState(null);
    const [timeslots, setTimeslots] = useState([]);

    const handleToggle = (fieldId) => {
        if (!selectedDate) return;
        setOpenFieldId(openFieldId === fieldId ? null : fieldId);
    };
    function handleScrollToTimetable() {
        timetableRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (!selectedDate) return;

        axios
            .get(route("getTimeslotsByVenue", { venue: venue.slug }), {
                params: { date: selectedDate.toISODate() },
            })
            .then((res) => {
                setTimeslots(res.data.fields);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [selectedDate]);

    const handleAddToCart = async (field, slot) => {
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
                date: selectedDate.toISODate(),
                total_price: slot.price,
            });
            toast.success("Berhasil ditambahkan ke cart");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan ke cart"
            );
        }
    };

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
                <VenueGalleryImage images={venue.images} />
                <div className="py-8 flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col flex-1 gap-2">
                        <VenueInfo
                            name={venue.name}
                            rating="4.8"
                            description={venue.description}
                            phone_number={venue.phone_number}
                        />
                        <VenueLocation address={venue.location} />
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
                                            venue.min_price
                                                ? venue.min_price.toLocaleString()
                                                : "0"
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
                <div className="py-8 flex flex-col gap-2">
                    <span className="text-lg font-bold">Fasilitas:</span>
                    <VenueFacility facilities={venue.facilities} />
                </div>
                <div ref={timetableRef} className="py-8 flex flex-col gap-2">
                    <span className="text-lg font-bold">Pilih Jadwal:</span>
                    <div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                console.log(
                                    "selectedDate di Venue:",
                                    date.toISO()
                                );
                                setSelectedDate(date);
                            }}
                        />
                    </div>
                </div>
                <div className="p-4 flex flex-col">
                    {venue.fields.map((field) => {
                        // cari timeslot field ini dari API
                        const fieldTimeslots =
                            timeslots.find((f) => f.id === field.id)
                                ?.timeslots || [];

                        return (
                            <div
                                key={field.id}
                                className="my-6 flex flex-col md:flex-row gap-4"
                            >
                                <img
                                    src={field.image}
                                    alt=""
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
                                                    selectedDate.toISODate()
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
                                                        selected={isSlotInCart(
                                                            field.id,
                                                            slot.timeslot_id,
                                                            selectedDate.toISODate()
                                                        )}
                                                        disabled={isSlotInCart(
                                                            field.id,
                                                            slot.timeslot_id,
                                                            selectedDate.toISODate()
                                                        )}
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
