import { useForm } from "@inertiajs/react";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import { Save, SaveAll, Undo2 } from "lucide-react";
import CourtTimeSlotManager from "./CourtTimeSlotManager";
import { mapTimeSlotInitialData } from "@/utils/courtMapper";

export default function CourtTimeSlotModal({
    show,
    onClose,
    venue,
    court,
    timeSlots,
}) {
    const weekday = mapTimeSlotInitialData(court.timeSlots, "weekday");
    const weekend = mapTimeSlotInitialData(court.timeSlots, "weekend");
    const holiday = mapTimeSlotInitialData(court.timeSlots, "holiday");

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",

        timeSlots: {
            weekday: weekday.ids || [],
            weekend: weekend.ids || [],
            holiday: holiday.ids || [],
        },
        prices: {
            weekday: weekday.prices || {},
            weekend: weekend.prices || {},
            holiday: holiday.prices || {},
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(
            route("merchant.venues.courts.updateCourtTimeSlots", {
                venue: venue.slug,
                court: court.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Slot jam lapangan berhasil diperbarui.");
                    onClose();
                },
                onError: () => {
                    toast.error(
                        "Gagal memperbarui. Periksa kembali inputan Anda."
                    );
                },
            }
        );
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="4xl"
            className="p-4 w-full"
        >
            <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
                <CloseButtonModal onClose={onClose} />
                <form
                    onSubmit={handleSubmit}
                    className="animate-in fade-in duration-500"
                >
                    <CardHeader className="py-2 px-4 border-none">
                        <h2 className="font-bold text-lg">
                            Pilih Jadwal Jam/Slot
                        </h2>
                    </CardHeader>
                    <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                        <CourtTimeSlotManager
                            timeSlots={timeSlots}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </CardBody>
                    <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                        <Button
                            variant="primary"
                            size="xs"
                            type="submit"
                            disabled={processing}
                            className="flex gap-2"
                        >
                            <SaveAll className="w-4 h-4" />
                            <span>Simpan</span>
                        </Button>
                        <Button
                            variant="light"
                            size="xs"
                            type="button"
                            onClick={onClose}
                            className="flex gap-2"
                        >
                            <Undo2 className="w-4 h-4" />
                            <span>Batal</span>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
