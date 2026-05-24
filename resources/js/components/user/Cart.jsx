import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import Checkbox from "@/components/common/Checkbox";
import { X } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatRupiah } from "@/utils/currency";
import { formatFullDate } from "@/utils/date";
import { getDayType } from "@/utils/attributes/courtAttribute";
import Badge from "../Common/Badge";

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
            className="w-[75vw] sm:max-w-sm"
        >
            <Card className="relative px-2 rounded-none border-none shadow-none text-gray-700 dark:text-gray-100 text-xs">
                <CloseButtonModal onClose={onClose} />

                <CardHeader className="py-6 dark:border-none">
                    <div className="text-lg font-semibold">
                        Slot Jadwal Dipilih
                    </div>
                </CardHeader>

                <CardBody>
                    {loading && (
                        <p className="text-center font-semibold">
                            Memuat keranjang...
                        </p>
                    )}

                    {!loading && carts.length === 0 && (
                        <BannerAlert
                            type="warning"
                            size="xs"
                            className="text-center text-xs font-semibold"
                        >
                            Tidak ada slot jadwal yang dipilih.
                        </BannerAlert>
                    )}

                    {carts.map((venue) => {
                        const disableVenue =
                            selectedVenueId &&
                            venue.venue.id !== selectedVenueId;

                        const selectedCount = venue.dates.reduce(
                            (acc, date) =>
                                acc +
                                date.courts.reduce(
                                    (acc2, court) =>
                                        acc2 +
                                        court.timeSlots.filter((slot) =>
                                            selectedSlots.includes(
                                                slot.cart_id,
                                            ),
                                        ).length,
                                    0,
                                ),
                            0,
                        );

                        return (
                            <div key={venue.venue.id} className="mb-4">
                                <h2 className="text-base font-bold dark:text-white mb-2">
                                    {venue.venue.name}
                                </h2>

                                {venue.dates.map((date) => (
                                    <div key={date.date} className="mb-6">
                                        <div className="flex gap-2 items-center border-b border-secondary-200 dark:border-secondary-700 pb-1 mb-3">
                                            <div className="uppercase font-semibold text-primary-600 dark:text-primary-500 text-[11px]">
                                                {formatFullDate(date.date)}
                                            </div>

                                            {date.day_type && (
                                                <Badge
                                                    color={
                                                        getDayType(
                                                            date.day_type,
                                                        ).color
                                                    }
                                                    className="text-[9px] px-1.5 py-0.5 font-bold"
                                                >
                                                    {
                                                        getDayType(
                                                            date.day_type,
                                                        ).label
                                                    }
                                                </Badge>
                                            )}
                                        </div>

                                        {date.courts.map((court) => (
                                            <div key={court.court.id}>
                                                {court.timeSlots.map((slot) => (
                                                    <div
                                                        key={slot.cart_id}
                                                        className={`relative px-3 py-3 flex items-center border-l-4 rounded-md mb-2 transition-all
                                                            ${
                                                                disableVenue
                                                                    ? "bg-gray-100 dark:bg-gray-800 border-gray-400 opacity-50 cursor-not-allowed"
                                                                    : "bg-primary-50 dark:bg-primary-900/30 border-primary-600 hover:bg-primary-100"
                                                            }`}
                                                    >
                                                        <div className="flex flex-row gap-3 items-center w-full">
                                                            <Checkbox
                                                                checked={selectedSlots.includes(
                                                                    slot.cart_id,
                                                                )}
                                                                onChange={() =>
                                                                    toggleSlot(
                                                                        slot.cart_id,
                                                                        venue
                                                                            .venue
                                                                            .id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    disableVenue
                                                                }
                                                                className="rounded"
                                                            />

                                                            <div className="flex flex-col gap-0.5 dark:text-gray-200">
                                                                <div className="flex flex-wrap items-baseline md:gap-1.5">
                                                                    <span className="font-bold text-xs truncate">
                                                                        {
                                                                            court
                                                                                .court
                                                                                .name
                                                                        }
                                                                    </span>

                                                                    <span className="font-medium text-xs text-gray-600 dark:text-gray-300">
                                                                        {slot.start_time?.substring(
                                                                            0,
                                                                            5,
                                                                        )}{" "}
                                                                        -{" "}
                                                                        {slot.end_time?.substring(
                                                                            0,
                                                                            5,
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <span className="font-bold text-primary-600 dark:text-primary-500 text-[13px]">
                                                                    {formatRupiah(
                                                                        slot.price,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {!disableVenue && (
                                                            <button
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        slot.cart_id,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 text-secondary-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
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
                                    className="w-full rounded-md mt-2 shadow-sm"
                                    onClick={() =>
                                        checkoutVenue(venue.venue.id)
                                    }
                                    disabled={
                                        selectedCount === 0 || disableVenue
                                    }
                                >
                                    Pesan Venue Ini ({selectedCount} Slot)
                                </Button>
                            </div>
                        );
                    })}
                </CardBody>
            </Card>
        </Modal>
    );
}
