import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import Button from "@/components/Common/Button";
import IconButton from "@/components/Common/IconButton";
import { Trash2, Dot, ArrowLeft } from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { formatFullDateWithDay } from "@/utils/date";
import { formatDistrictCity } from "@/utils/address";
import BannerAlert from "@/components/Common/BannerAlert";
import { router } from "@inertiajs/react";

export default function PreviewBooking({
    carts,
    filteredSlotsByDate = {},
    toggleSlot,
}) {
    const venue = carts[0]?.venue;

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            {/* Header Venue */}
            <CardHeader className="pb-4 border-b">
                <div className="text-xl font-bold text-secondary-500 dark:text-white">
                    {venue?.name || "Venue"}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {formatDistrictCity(
                        venue?.address?.district,
                        venue?.address?.city
                    )}
                </div>
            </CardHeader>

            {/* Body */}
            <CardBody>
                {Object.keys(filteredSlotsByDate).length === 0 ? (
                    <BannerAlert type="warning" className="text-center">
                        Belum ada slot yang dipilih. Tidak bisa checkout.
                    </BannerAlert>
                ) : (
                    Object.entries(filteredSlotsByDate).map(([date, slots]) => (
                        <div key={date} className="mb-4">
                            <div className="pb-2 uppercase font-semibold">
                                {formatFullDateWithDay(date)}
                            </div>

                            {slots.map((slot) => (
                                <div
                                    key={`${slot.cart_id}-${slot.timeslot_id}`}
                                    className="px-4 py-2 flex justify-between items-center border-l-4 mb-2 
                                               bg-primary-200 dark:bg-primary-800 
                                               border-primary-700 dark:border-primary-900 
                                               hover:bg-primary-300 dark:hover:bg-primary-900 
                                               rounded-md"
                                >
                                    <div className="flex flex-col dark:text-gray-200">
                                        <span className="flex items-center">
                                            {slot.field_name}{" "}
                                            <Dot className="w-4 h-4 mx-1" />{" "}
                                            {slot.timeslot_name}
                                        </span>
                                        <span className="font-semibold">
                                            {formatRupiah(slot.original_price)}
                                        </span>
                                    </div>

                                    <IconButton
                                        tooltip="Hapus"
                                        onClick={() =>
                                            toggleSlot(
                                                slot.cart_id,
                                                slot.venue_id
                                            )
                                        }
                                    >
                                        <Trash2 className="w-5 h-5 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer" />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </CardBody>

            {/* Footer */}
            <CardFooter className="pt-4 border-t text-right">
                <Button
                    variant="primary"
                    onClick={() =>
                        router.visit(
                            route("venues.show", venue?.slug) + "#timetable"
                        )
                    }
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Tambah Slot Jadwal
                </Button>
            </CardFooter>
        </Card>
    );
}
