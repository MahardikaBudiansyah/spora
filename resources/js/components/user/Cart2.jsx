import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import Checkbox from "@/components/common/Checkbox";
import { Trash2 } from "lucide-react";
import BannerAlert from "../Common/BannerAlert";

export default function Cart({ isOpen, onClose }) {
    const {
        cartItems,
        loading,
        fetchCartItems,
        selectedSlots,
        selectedVenueId,
        removeItem,
        toggleSlot,
        checkoutVenue,
    } = useCart();

    useEffect(() => {
        if (isOpen) fetchCartItems();
    }, [isOpen]);

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            closeable
            sidebarRight
            className="w-[40vh] sm:max-w-sm md:max-w-sm lg:max-w-xs"
        >
            <Card className="relative px-2 rounded-none border-none shadow-none text-gray-700 dark:text-gray-100 text-xs">
                <CloseButtonModal onClose={onClose} />
                <form>
                    <CardHeader className="py-6 dark:border-none ">
                        <div className="text-lg font-semibold">
                            Slot Jadwal Dipilih
                        </div>
                    </CardHeader>

                    <CardBody>
                        {loading && <p>Loading...</p>}
                        {!loading && cartItems.length === 0 && (
                            <BannerAlert type="warning" className="text-center">
                                Tidak ada slot jadwal yang dipilih.
                            </BannerAlert>
                        )}

                        {cartItems.map((venueGroup) => {
                            const disableVenue =
                                selectedVenueId &&
                                venueGroup.venue.id !== selectedVenueId;

                            // Hitung total slot yang dipilih untuk venue ini
                            const selectedCount = venueGroup.fields.reduce(
                                (acc, fieldGroup) =>
                                    acc +
                                    fieldGroup.dates.reduce(
                                        (acc2, dateGroup) =>
                                            acc2 +
                                            dateGroup.timeslots.filter((slot) =>
                                                selectedSlots.includes(slot.id)
                                            ).length,
                                        0
                                    ),
                                0
                            );

                            return (
                                <div key={venueGroup.venue.id} className="mb-4">
                                    <h2 className="text-lg font-bold dark:text-white mb-2">
                                        {venueGroup.venue.name}
                                    </h2>

                                    {venueGroup.fields.map((fieldGroup) =>
                                        fieldGroup.dates.map((dateGroup) => (
                                            <div
                                                key={dateGroup.date}
                                                className="mb-3"
                                            >
                                                <h3 className="italic dark:text-gray-400 mb-1">
                                                    {dateGroup.date}
                                                </h3>

                                                {dateGroup.timeslots.map(
                                                    (slot) => (
                                                        <div
                                                            key={slot.id}
                                                            className={`px-4 py-3 flex justify-between items-center border-l-4 mb-1
                                                            ${
                                                                disableVenue
                                                                    ? "bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 opacity-50 cursor-not-allowed"
                                                                    : "bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900"
                                                            }`}
                                                        >
                                                            <div className="flex flex-row gap-4 items-center">
                                                                <Checkbox
                                                                    checked={selectedSlots.includes(
                                                                        slot.id
                                                                    )}
                                                                    onChange={() =>
                                                                        toggleSlot(
                                                                            slot.id,
                                                                            venueGroup
                                                                                .venue
                                                                                .id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        disableVenue
                                                                    }
                                                                    className="rounded"
                                                                />
                                                                <div className="flex flex-col gap-1 dark:text-gray-200">
                                                                    <span>
                                                                        {slot
                                                                            .timeSlot
                                                                            ?.name ||
                                                                            "Jam"}
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        Rp{" "}
                                                                        {Number(
                                                                            slot.total_price
                                                                        ).toLocaleString()}
                                                                    </span>
                                                                    {slot.status_label && (
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {
                                                                                slot.status_label
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {!disableVenue && (
                                                                <Trash2
                                                                    className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 cursor-pointer"
                                                                    onClick={() =>
                                                                        removeItem(
                                                                            slot.id
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    )}

                                    <Button
                                        variant="primary"
                                        size="xs"
                                        className="w-full rounded-none mt-2"
                                        onClick={() =>
                                            checkoutVenue(venueGroup.venue.id)
                                        }
                                        disabled={
                                            selectedCount === 0 || disableVenue
                                        }
                                    >
                                        Pesan Venue Ini
                                    </Button>
                                </div>
                            );
                        })}
                    </CardBody>
                </form>
            </Card>
        </Modal>
    );
}
