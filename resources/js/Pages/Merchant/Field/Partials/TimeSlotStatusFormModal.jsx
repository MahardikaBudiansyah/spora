import { useState, useCallback, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { toISODate, formatCustom } from "@/utils/date";
import Button from "@/components/Common/Button";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import InputLabel from "@/components/common/Labelnput";
import Table from "@/components/Common/Table";
import Checkbox from "@/components/Common/Checkbox";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/common/DatePickerInput";
import { toast } from "react-toastify";

const columns = [
    { key: "checkbox", header: "", className: "text-center" },
    { key: "timeSlots", header: "SLOT JAM", className: "text-center" },
    { key: "status", header: "STATUS", className: "text-center" },
    {
        key: "updated_at",
        header: "TERAKHIR DIPERBARUI",
        className: "text-center",
    },
];

export default function TimeSlotStatusFormModal({
    isOpen,
    onClose,
    venue,
    field,
    slotStatusLabel,
    selectedDate,
    setSelectedDate,
    timeslots = [],
    refreshTimeslots,
}) {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [statusId, setStatusId] = useState("");

    const { data, setData, processing, reset } = useForm({
        date: selectedDate,
        status_id: statusId,
        timeslot_ids: [],
    });

    const selectedDateFormatted = selectedDate
        ? formatCustom(selectedDate, "cccc, dd MMMM yyyy")
        : "-";

    // Reset state saat modal dibuka/tutup
    useEffect(() => {
        if (!isOpen) {
            setSelectedSlots([]);
            setStatusId(
                slotStatusLabel.find((s) => s.label === "Tersedia")?.id || ""
            );
        }
    }, [isOpen, slotStatusLabel]);

    // Update form data setiap perubahan selectedDate, statusId, atau selectedSlots
    useEffect(() => {
        setData({
            date: selectedDate,
            status_id: statusId,
            timeslot_ids: selectedSlots.map((s) => s.timeslot_id),
        });
    }, [selectedDate, statusId, selectedSlots, setData]);

    // Reset selected slots saat tanggal berubah
    useEffect(() => {
        setSelectedSlots([]);
    }, [selectedDate]);

    const tableData = timeslots.map((slot) => ({
        timeslot_id: slot.timeslot_id,
        checkbox: false,
        timeSlots: slot.name ?? slot.time ?? "-",
        status: slot.status_label || slot.status || "Tersedia",
        updated_at: slot.updated_at || "-",
    }));

    const handleSelect = useCallback(
        (id) => {
            const slot = timeslots.find((s) => s.timeslot_id === id);
            if (!slot) return;

            const firstStatus =
                selectedSlots[0]?.status_label ||
                selectedSlots[0]?.status ||
                null;
            const isSelected = selectedSlots.some((s) => s.timeslot_id === id);

            if (isSelected) {
                setSelectedSlots((prev) =>
                    prev.filter((s) => s.timeslot_id !== id)
                );
            } else if (
                !firstStatus ||
                (slot.status_label || slot.status) === firstStatus
            ) {
                setSelectedSlots((prev) => [...prev, slot]);
            } else {
                toast.warning(
                    "Slot yang dipilih harus memiliki status yang sama."
                );
            }
        },
        [selectedSlots, timeslots]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedData = {
            ...data,
            date: toISODate(data.date),
            timeslot_ids: data.timeslot_ids.filter(
                (id) => typeof id === "number" && !isNaN(id)
            ),
        };

        router.post(
            route("merchant.venues.fields.updateTimeslotStatuses", {
                venue: venue.slug,
                field: field.slug,
            }),
            cleanedData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        "Status Slot jam lapangan berhasil diperbarui."
                    );
                    reset();
                    onClose();
                    refreshTimeslots?.();
                },
                onError: () => {
                    toast.error("Status Slot jam lapangan gagal diperbarui.");
                },
            }
        );
    };

    const disabledStatuses = ["dipesan", "booked"];

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl" className="p-4">
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100 text-xs">
                <CloseButtonModal onClose={onClose} />
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CardHeader className="border-none">
                        <div className="text-lg font-semibold my-2">
                            Form Perbarui Status Slot
                        </div>
                    </CardHeader>

                    <CardBody>
                        {/* Informasi Lapangan */}
                        <div className="flex flex-col uppercase">
                            <div className="pb-1 font-bold normal-case">
                                Informasi Lapangan
                            </div>

                            <div className="py-1 flex flex-row gap-2 items-center">
                                <label className="w-2/6 md:w-1/5 font-bold">
                                    Venue
                                </label>
                                <span>:</span>
                                <span>{field?.venue?.name}</span>
                            </div>

                            <div className="py-1 flex flex-row gap-2 items-center">
                                <label className="w-2/6 md:w-1/5 font-bold">
                                    Lapangan
                                </label>
                                <span>:</span>
                                <span>{field?.name}</span>
                            </div>

                            <div className="py-1 flex flex-row gap-2 md:items-center">
                                <div className="flex flex-row w-2/6 md:w-1/5">
                                    <InputLabel
                                        htmlFor="date"
                                        className="text-xs font-bold"
                                    >
                                        Tanggal
                                    </InputLabel>
                                </div>
                                <span>:</span>
                                <div className="flex flex-1 flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                                    <span>{selectedDateFormatted}</span>
                                    <div className="flex-1">
                                        <DatePickerInput
                                            value={selectedDate}
                                            onChange={setSelectedDate}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="py-1 flex flex-row gap-2 items-center">
                                <label className="w-2/6 md:w-1/5 font-bold">
                                    Tipe Lapangan
                                </label>
                                <span>:</span>
                                <span>{field?.field_type}</span>
                            </div>

                            <div className="py-1 flex flex-row gap-2 items-center">
                                <InputLabel
                                    htmlFor="timeslotStatus"
                                    className="w-2/6 md:w-1/5 text-xs font-bold"
                                >
                                    Status Slot
                                </InputLabel>
                                <span>:</span>
                                <div className="flex-1 text-xs">
                                    <SelectInput
                                        id="timeslotStatus"
                                        name="timeslotStatus"
                                        value={data.status_id}
                                        onChange={setStatusId}
                                        options={slotStatusLabel.map(
                                            (status) => ({
                                                value: status.id,
                                                label: status.label,
                                                disabled:
                                                    disabledStatuses.includes(
                                                        status.label.toLowerCase()
                                                    ),
                                            })
                                        )}
                                        isClearable={false}
                                        isSearchable={false}
                                        placeholder="Pilih Status"
                                        className="py-0 px-3 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Slot Jam */}
                        <div className="flex flex-col gap-2 uppercase">
                            <div className="pb-1 font-bold normal-case">
                                Slot Jam
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                <Table
                                    columns={columns}
                                    data={tableData}
                                    renderCell={(col, row) =>
                                        col.key === "checkbox" ? (
                                            <Checkbox
                                                checked={selectedSlots.some(
                                                    (s) =>
                                                        s.timeslot_id ===
                                                        row.timeslot_id
                                                )}
                                                onChange={() =>
                                                    handleSelect(
                                                        row.timeslot_id
                                                    )
                                                }
                                            />
                                        ) : (
                                            row[col.key] ||
                                            (col.key === "updated_at"
                                                ? "-"
                                                : null)
                                        )
                                    }
                                    getTrProps={(row) => {
                                        const status = row.status;
                                        const classes = {
                                            Tersedia:
                                                "bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-900 font-semibold",
                                            Dipesan:
                                                "bg-rose-100 dark:bg-rose-300 border-rose-200 dark:border-rose-400 dark:text-gray-900 hover:bg-rose-200 dark:hover:bg-rose-400 font-semibold",
                                            Event: "bg-yellow-100 dark:bg-yellow-300 border-yellow-200 dark:border-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-400 dark:text-gray-900 font-semibold",
                                            Pemeliharaan:
                                                "bg-sky-100 dark:bg-sky-300 border-sky-200 dark:border-sky-400 hover:bg-sky-200 dark:hover:bg-sky-400 dark:text-gray-900 font-semibold",
                                        };
                                        return {
                                            className: classes[status] || "",
                                        };
                                    }}
                                    getTdProps={(col, row) =>
                                        col.key === "updated_at" &&
                                        !row.updated_at
                                            ? {
                                                  className:
                                                      "text-gray-400 italic",
                                              }
                                            : {}
                                    }
                                    wrapperClassName="rounded-none border-none"
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="p-4 border-none flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={processing}
                        >
                            Simpan
                        </Button>
                        <Button variant="light" type="button" onClick={onClose}>
                            Kembali
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
