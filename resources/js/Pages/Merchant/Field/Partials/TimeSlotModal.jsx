import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import TimeSlotSelector from "@/Pages/Merchant/Field/Partials/TimeSlotSelector";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import { toISODate } from "@/utils/date";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";

export default function TimeSlotModal({ show, onClose }) {
    const { venue = {}, field, timeslots = [] } = usePage().props;

    const [selectedSlots, setSelectedSlots] = useState([]);
    const [slotPrices, setSlotPrices] = useState({});
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show) {
            const selected =
                field?.slots?.map((slot) => slot.timeslot_id) || [];
            const prices = {};
            field?.slots?.forEach((slot) => {
                prices[slot.timeslot_id] = slot.price;
            });

            setSelectedSlots(selected);
            setSlotPrices(prices);
            setErrors({});
        }
    }, [field, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route("merchant.venues.fields.updateTimeslots", {
                venue: venue.slug,
                field: field.slug,
            }),
            {
                timeslot_ids: selectedSlots,
                prices: slotPrices,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Slot jam lapangan berhasil diperbarui.");
                    setProcessing(false);
                    onClose();
                },
                onError: (errors) => {
                    setProcessing(false);
                    if (errors?.timeslot_ids || errors?.prices) {
                        toast.error(
                            "Pastikan semua harga dan pilihan slot diisi dengan benar."
                        );
                    } else {
                        toast.error("Slot jam lapangan gagal diperbarui.");
                    }
                },
            }
        );
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="4xl"
            className="overflow-visible py-8 px-10"
        >
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100 ">
                <CloseButtonModal onClose={onClose} />
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-none">
                        <div className="text-lg font-semibold my-2">
                            Pilih Jadwal Jam & Harga
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TimeSlotSelector
                            value={selectedSlots}
                            onChange={setSelectedSlots}
                            prices={slotPrices}
                            setPrices={setSlotPrices}
                            timeSlots={timeslots}
                            errors={errors}
                            gridClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                        />
                    </CardBody>
                    <CardFooter className="p-4 border-none flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={processing}
                        >
                            Perbarui
                        </Button>
                        <Button
                            variant="light"
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 text-sm"
                        >
                            Batal
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
