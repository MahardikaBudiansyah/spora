import React, { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCourtAvailability } from "@/features/orders/hooks/useCourtAvailability";
import { toast } from "react-toastify";
import { parseDate, toISODate } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import UserLayout from "@/Layouts/UserLayout";
import useEcho from "@/hooks/useEcho";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/common/Button";
import DatePicker from "@/components/user/DatePicker";
import VenueGalleryImage from "../Partials/VenueGalleryImage";
import VenueInfo from "@/components/Venues/VenueInfo";
import VenueFacility from "@/components/Venues/VenueFacility";
import VenueAddress from "@/components/Venues/VenueAddress";
import VenueMembershipPackage from "@/features/venues/components/VenueMembershipPackage";
import CourtCard from "@/components/Courts/CourtCard";
import VenuePaymentInfo from "@/components/Venues/VenuePaymentInfo";

export default function Show() {
    const { user, authenticated } = useAuth();
    const { auth, venue: venueResource } = usePage().props;
    const venue = venueResource.data;

    const { openModal } = useAuthModal();
    const { addToCart, carts } = useCart();

    const [selectedDate, setSelectedDate] = useState(parseDate(new Date()));

    const { availabilityData: courts, loading } = useCourtAvailability(
        venue,
        selectedDate,
    );

    // useEffect(() => {
    //     if (courts) {
    //         console.group("📅 Availability Data Updated");
    //         console.log("Tanggal Terpilih:", toISODate(selectedDate));
    //         console.log("Data Courts:", courts);
    //         console.groupEnd();
    //     }
    // }, [courts, selectedDate]);

    const [openCourts, setOpenCourts] = useState([]);
    const [expandedPackageIds, setExpandedPackageIds] = useState({});

    const handleTogglePackage = (packageId) => {
        setExpandedPackageIds((prev) => ({
            ...prev,
            [packageId]: !prev[packageId],
        }));
    };

    const handleAddToCart = React.useCallback(
        async (court, slot) => {
            if (slot.status_label !== "Tersedia") {
                toast.warning("Slot ini tidak tersedia untuk dipesan.");
                return;
            }

            if (!auth.user) {
                toast.warning(
                    "Anda harus login dulu untuk menambahkan ke keranjang.",
                );
                openModal("login");
                return;
            }

            try {
                await addToCart({
                    venue_id: venue.id,
                    court_id: court.id,
                    time_slot_id: slot.timeslot_id,
                    date: toISODate(selectedDate),
                    price: slot.price,
                });
            } catch (error) {}
        },
        [auth.user, venue.id, selectedDate, addToCart, openModal],
    );

    const handleToggle = React.useCallback((courtId) => {
        setOpenCourts((prev) =>
            prev.includes(courtId)
                ? prev.filter((id) => id !== courtId)
                : [...prev, courtId],
        );
    }, []);

    const getTimeslotsForCourt = (courtId) => {
        const found = courts?.find((c) => c.id === courtId);
        // Console log ini akan muncul setiap kali CourtCard dirender/di-toggle
        // console.log(`🔍 Sloting untuk Court ID ${courtId}:`, found?.timeslots);
        return found ? found.timeslots : [];
    };

    // useEcho(`venue.${venue.id}`, ".CourtScheduleUpdated", (e) => {
    //     setTimeslots((prev) =>
    //         prev.map((court) => {
    //             if (court.id !== e.court_id) return court;

    //             return {
    //                 ...court,
    //                 timeslots: court.timeslots.map((slot) =>
    //                     e.timeslot_ids.includes(slot.timeslot_id)
    //                         ? {
    //                               ...slot,
    //                               status_label:
    //                                   e.status_id === 1 ? "Tersedia" : "Booked",
    //                           }
    //                         : slot,
    //                 ),
    //             };
    //         }),
    //     );
    // });

    const isSlotInCart = React.useCallback(
        (courtId, timeslotId, date) => {
            if (!carts) return false;

            return carts.some((venueGroup) =>
                venueGroup.dates.some(
                    (dateGroup) =>
                        dateGroup.date === date &&
                        dateGroup.courts.some(
                            (courtGroup) =>
                                courtGroup.court.id === courtId &&
                                courtGroup.timeSlots.some(
                                    (slot) =>
                                        (slot.time_slot_id ||
                                            slot.timeslot_id) === timeslotId,
                                ),
                        ),
                ),
            );
        },
        [carts],
    );

    const timetableRef = useRef(null);
    const handleScrollToTimetable = () => {
        timetableRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (window.location.hash === "#timetable") {
            timetableRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <UserLayout>
            <Head title={venue.name} />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-gray-800 dark:text-white">
                {venue.images?.length > 0 && (
                    <VenueGalleryImage images={venue.images} />
                )}

                <div className="pt-8 flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col flex-1 gap-2">
                        <VenueInfo
                            showLabel={true}
                            name={venue.name}
                            rating={Number(venue.rating ?? 0).toFixed(1)}
                            reviewCount={venue.review_count ?? 0}
                            description={venue.description}
                            phone_number={venue.phone_number}
                            address={venue.address}
                            categories={venue.venue_categories ?? []}
                            social_media={venue.social_media}
                        />

                        {venue.address && (
                            <VenueAddress address={venue.address} />
                        )}
                    </div>

                    <div className="w-full md:w-3/12">
                        <div className="p-6 bg-white dark:bg-secondary-900 rounded-md flex flex-col gap-3">
                            <span>Mulai dari:</span>
                            <div>
                                <span className="font-bold text-lg">
                                    {formatRupiah(venue.min_price)}
                                </span>
                                <span>/ sesi</span>
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

                {/* FASILITAS */}
                {venue.facilities?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-6">
                        <VenueFacility
                            showLabel={true}
                            facilities={venue.facilities}
                        />
                    </div>
                )}

                {/* MEMBERSHIP */}
                <div className="py-8">
                    {venue.membership_packages?.length > 0 && (
                        <VenueMembershipPackage
                            packages={venue.membership_packages}
                            onBuy={(pkg) => console.log("Beli paket:", pkg)}
                            mode="user"
                            showLabel={true}
                            expandedPackageIds={expandedPackageIds}
                            onTogglePackage={handleTogglePackage}
                            authenticated={authenticated}
                            openModal={openModal}
                        />
                    )}
                </div>
                {venue.payment_type && (
                    <div className="flex">
                        <VenuePaymentInfo paymentType={venue.payment_type} />
                    </div>
                )}

                <div id="timetable" ref={timetableRef} className="py-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                            Pilih Jadwal Slot
                        </h3>
                    </div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                    />
                </div>

                <div className="p-4 flex flex-col">
                    {venue?.courts?.map((court) => (
                        <CourtCard
                            key={court.id}
                            court={court}
                            timeslots={getTimeslotsForCourt(court.id)}
                            isOpen={openCourts.includes(court.id)}
                            onToggle={handleToggle}
                            loading={loading}
                            isSlotInCart={isSlotInCart}
                            handleAddToCart={handleAddToCart}
                            selectedDate={selectedDate}
                            toISODate={toISODate}
                        />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
