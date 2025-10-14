import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import IconButton from "@/components/Common/IconButton";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import Checkbox from "@/components/common/Checkbox";
import { Trash2 } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatRupiah } from "@/utils/currency";
import { formatFullDate } from "@/utils/date";

export default function Cart({ isOpen, onClose }) {
    const {
        carts,
        loading,
        fetchCarts,
        selectedSlots,
        selectedVenueId,
        removeFromCart,
        toggleSlot,
        checkoutVenue,
    } = useCart();

    useEffect(() => {
        if (isOpen) fetchCarts();
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
                <CardHeader className="py-6 dark:border-none">
                    <div className="text-lg font-semibold">
                        Slot Jadwal Dipilih
                    </div>
                </CardHeader>

                <CardBody>
                    {loading && <p>Loading...</p>}

                    {!loading && carts.length === 0 && (
                        <BannerAlert type="warning" className="text-center">
                            Tidak ada slot jadwal yang dipilih.
                        </BannerAlert>
                    )}

                    {carts.map((venue) => {
                        const disableVenue =
                            selectedVenueId &&
                            venue.venue.id !== selectedVenueId;

                        // Hitung selectedCount per venue
                        const selectedCount = venue.dates.reduce(
                            (acc, date) =>
                                acc +
                                date.fields.reduce(
                                    (acc2, field) =>
                                        acc2 +
                                        field.timeslots.filter((slot) =>
                                            selectedSlots.includes(slot.cart_id)
                                        ).length,
                                    0
                                ),
                            0
                        );

                        return (
                            <div key={venue.venue.id} className="mb-4">
                                <h2 className="text-lg font-bold dark:text-white mb-2">
                                    {venue.venue.name}
                                </h2>

                                {venue.dates.map((date) => (
                                    <div key={date.date} className="mb-3">
                                        <div className="uppercase font-semibold dark:text-gray-400 mb-1">
                                            {formatFullDate(date.date)}
                                        </div>

                                        {date.fields.map((field) => (
                                            <div
                                                key={field.field.id}
                                                className="mb-2"
                                            >
                                                <div className="font-semibold mb-1 text-sm dark:text-gray-300">
                                                    {field.field.name}
                                                </div>

                                                {field.timeslots.map((slot) => (
                                                    <div
                                                        key={slot.cart_id}
                                                        className={`px-4 py-2 flex justify-between items-center border-l-4 rounded-md mb-1
                                                            ${
                                                                disableVenue
                                                                    ? "bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 opacity-50 cursor-not-allowed"
                                                                    : "bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900"
                                                            }`}
                                                    >
                                                        <div className="flex flex-row gap-4 items-center">
                                                            <Checkbox
                                                                checked={selectedSlots.includes(
                                                                    slot.cart_id
                                                                )}
                                                                onChange={() =>
                                                                    toggleSlot(
                                                                        slot.cart_id,
                                                                        venue
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
                                                                    {slot.name}
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {formatRupiah(
                                                                        slot.price
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {!disableVenue && (
                                                            <IconButton
                                                                tooltip="Hapus"
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        slot.cart_id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-5 h-5 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer" />
                                                            </IconButton>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                <Button
                                    variant="primary"
                                    size="xs"
                                    className="w-full rounded-md mt-2"
                                    onClick={() =>
                                        checkoutVenue(venue.venue.id)
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
            </Card>
        </Modal>
    );
}
