import { useState } from "react";
import Modal from "@/components/common/Modal";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatRupiah } from "@/utils/currency";
import SelectInput from "@/components/Common/SelectInput";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import { formatFullDate } from "@/utils/date";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function TimeSlotInfoModal({
    show,
    onClose,
    slot,
    selectedDate,
    court,
    statusType = [],
    refreshTimeslots,
}) {
    if (!slot) return null;

    const statusKey = slot.status?.toLowerCase();
    const [isEditing, setIsEditing] = useState(false);
    const { status } = slot;
    const isBooked = ["dipesan", "booked"].includes(statusKey);

    const formattedTime = slot?.start_time
        ? `${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}`
        : "-";

    const statusColorMap = {
        tersedia: "green",
        dipesan: "red",
        booked: "red",
        event: "yellow",
        pemeliharaan: "blue",
    };

    const statusColor = statusColorMap[statusKey] || "gray";

    const { data, setData, post, processing } = useForm({
        date: selectedDate,
        status_id: slot.status_id,
        timeslot_id: slot.id,
    });

    useEffect(() => {
        if (slot) {
            setData({
                date: selectedDate,
                status_id: slot.status_id,
                timeslot_id: slot.id,
            });
            setIsEditing(false);
        }
    }, [slot]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(
            route("merchant.venues.courts.updateCourtSingleSchedule", {
                venue: court.venue.slug,
                court: court.slug,
            }),
            {
                preserveState: true,
                onSuccess: () => {
                    toast.success("Status berhasil diperbarui.");
                    setIsEditing(false);
                    onClose();
                    refreshTimeslots?.();
                },
            },
        );
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
            className="p-4 w-full overflow-visible"
        >
            <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
                <CloseButtonModal onClose={onClose} />
                <form
                    onSubmit={handleSubmit}
                    className="animate-in fade-in duration-500"
                >
                    <CardHeader className="py-2 px-4 border-none">
                        <h2 className="font-bold text-lg">Informasi Slot</h2>
                        <span className="text-xs font-medium ">
                            {formatFullDate(selectedDate)}
                        </span>
                    </CardHeader>

                    <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                        <div className="flex flex-row gap-8">
                            <div className="flex flex-col space-y-2 w-full">
                                <DescriptionItem
                                    label="Venue"
                                    value={court?.venue?.name || "-"}
                                    className="space-y-0"
                                />

                                <DescriptionItem
                                    label="Sesi"
                                    value={formattedTime || "-"}
                                    className="space-y-0"
                                />
                                {!isEditing && (
                                    <DescriptionItem
                                        label="Status"
                                        value={
                                            <Badge
                                                color={statusColor}
                                                className="capitalize"
                                            >
                                                {status}
                                            </Badge>
                                        }
                                    />
                                )}
                                {isEditing && (
                                    <div className="space-y-1">
                                        <span className="text-secondary-400 uppercase font-bold text-[11px]">
                                            Perbarui Status:
                                        </span>
                                        <SelectInput
                                            id="timeslotStatus"
                                            value={data.status_id}
                                            onChange={(val) =>
                                                setData("status_id", val)
                                            }
                                            options={statusType.map(
                                                (status) => ({
                                                    value: status.id,
                                                    label: status.label,
                                                    disabled: [
                                                        "dipesan",
                                                        "booked",
                                                    ].includes(
                                                        status.label.toLowerCase(),
                                                    ),
                                                }),
                                            )}
                                            isSearchable={false}
                                            isClearable={false}
                                            placeholder="Pilih Status..."
                                            className="w-full py-1 px-3 text-xs"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col space-y-2 w-full">
                                <DescriptionItem
                                    label="Lapangan"
                                    value={court?.name || "-"}
                                    className="space-y-0"
                                />
                                <DescriptionItem
                                    label="Harga"
                                    value={formatRupiah(slot?.price) || "-"}
                                    className="space-y-0"
                                />

                                <DescriptionItem
                                    label="Terakhir Diperbarui"
                                    value={slot?.updated_at || "-"}
                                    className="space-y-0"
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="py-2 px-4 flex justify-between gap-2 border-none">
                        <Button variant="light" onClick={handleClose}>
                            Tutup
                        </Button>

                        <div className="flex gap-2">
                            {!isEditing ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                    disabled={isBooked}
                                >
                                    Ubah Status
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={
                                            processing ||
                                            data.status_id === slot.status_id
                                        }
                                    >
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </Button>

                                    <Button
                                        variant="light"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setData(
                                                "status_id",
                                                slot.status_id,
                                            );
                                        }}
                                    >
                                        Batal
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
