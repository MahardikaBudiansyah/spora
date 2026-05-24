import { useState, useCallback, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { formatFullDate } from "@/utils/date";
import Button from "@/components/Common/Button";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Checkbox from "@/components/Common/Checkbox";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/Common/DatePickerInput";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import BannerAlert from "@/components/Common/BannerAlert";

export default function CourtScheduleFormModal({
    isOpen,
    onClose,
    venue,
    court,
    statusType = [],
    selectedDate,
    setSelectedDate,
    timeslots = [],
    refreshTimeslots,
}) {
    const { data, setData, post, processing, reset } = useForm({
        date: selectedDate,
        status_id: "",
        timeslot_ids: [],
    });

    const [selectedSlots, setSelectedSlots] = useState([]);

    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        if (isOpen) setShowBanner(true);
    }, [isOpen]);

    useEffect(() => {
        setData("date", selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (isOpen && statusType.length > 0) {
            const availableStatus = statusType.find(
                (s) => s.label.toLowerCase() === "tersedia",
            );
            if (availableStatus) {
                setData("status_id", availableStatus.id);
            }
        }
    }, [isOpen, statusType]);

    useEffect(() => {
        setSelectedSlots([]);
        setData("timeslot_ids", []);
    }, [selectedDate]);

    const handleSelect = useCallback(
        (id) => {
            const slot = timeslots.find((s) => s.id === id);
            if (!slot) return;

            const isBooked = ["dipesan", "booked"].includes(
                slot.status?.toLowerCase(),
            );

            if (isBooked) {
                toast.info("Slot yang sudah dipesan tidak dapat diubah.");
                return;
            }

            setSelectedSlots((prev) => {
                const isExisting = prev.some((s) => s.id === id);
                const newSlots = isExisting
                    ? prev.filter((s) => s.id !== id)
                    : [...prev, slot];

                setData(
                    "timeslot_ids",
                    newSlots.map((s) => s.id),
                );
                return newSlots;
            });
        },
        [timeslots, setData],
    );

    useEffect(() => {
        setSelectedSlots((prev) =>
            prev.filter((s) => timeslots.some((t) => t.id === s.id)),
        );
    }, [timeslots]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.timeslot_ids.length === 0) {
            toast.error("Pilih minimal satu slot jam.");
            return;
        }

        post(
            route("merchant.venues.courts.updateCourtSchedules", {
                venue: venue.slug,
                court: court.slug,
            }),
            {
                preserveState: true,
                onSuccess: () => {
                    toast.success("Status berhasil diperbarui.");
                    setSelectedSlots([]);
                    reset();
                    onClose();
                    refreshTimeslots?.();
                },
            },
        );
    };

    const tableData = timeslots.map((slot) => ({
        ...slot,
        timeSlots:
            slot.name ||
            `${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(
                0,
                5,
            )}`,
    }));

    const columns = [
        { key: "checkbox", header: "", className: "text-center w-10" },
        {
            key: "timeSlots",
            header: "SLOT JAM",
            className: "text-center whitespace-nowrap min-w-max",
        },
        {
            key: "status",
            header: "STATUS",
            className: "text-center whitespace-nowrap min-w-max",
        },
        {
            key: "updated_at",
            header: "TERAKHIR DIPERBARUI",
            className: "text-center",
        },
    ];

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            maxWidth="xl"
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
                            Form Perbarui Status Slot
                        </h2>
                        {showBanner && (
                            <BannerAlert
                                title="Petunjuk & Catatan"
                                type="warning"
                                showIcon={false}
                                closable={true}
                                onClose={() => setShowBanner(false)}
                                titleClassName="text-xs"
                                className="mb-0"
                            >
                                <div className="text-xs flex flex-col gap-1">
                                    <p>
                                        • Pilih slot pada tabel, tentukan
                                        'Status Baru', lalu klik Simpan.
                                    </p>
                                    <p className="font-medium">
                                        • Slot <strong>'Dipesan/Booked'</strong>{" "}
                                        tidak dapat diubah.
                                    </p>
                                </div>
                            </BannerAlert>
                        )}
                    </CardHeader>

                    <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                        <div className="flex flex-col text-sm space-y-2">
                            <div className="font-bold normal-case">
                                Informasi Lapangan
                            </div>

                            <div className="flex items-center">
                                <label className="w-1/4 font-bold">Venue</label>
                                <span className="mr-2">:</span>
                                <span>{court?.venue.name}</span>
                            </div>

                            <div className="flex items-center">
                                <label className="w-1/4 font-bold">
                                    Lapangan
                                </label>
                                <span className="mr-2">:</span>
                                <span>{court?.name}</span>
                            </div>

                            <div className="flex md:items-center">
                                <label className="w-1/4 font-bold">
                                    Tanggal
                                </label>
                                <span className="mr-2">:</span>
                                <div className="flex flex-col md:flex-row gap-2 items-start md:items-center flex-1">
                                    <span className="font-medium text-primary-600">
                                        {formatFullDate(selectedDate)}
                                    </span>
                                    <div className="w-full md:w-auto">
                                        <DatePickerInput
                                            value={selectedDate}
                                            onChange={setSelectedDate}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-1/4 font-bold">
                                    Status Baru
                                </label>
                                <span className="mr-2">:</span>
                                <div className="flex-1">
                                    <SelectInput
                                        id="timeslotStatus"
                                        value={data.status_id}
                                        onChange={(val) =>
                                            setData("status_id", val)
                                        }
                                        options={statusType.map((status) => ({
                                            value: status.id,
                                            label: status.label,
                                            disabled: [
                                                "dipesan",
                                                "booked",
                                            ].includes(
                                                status.label.toLowerCase(),
                                            ),
                                        }))}
                                        isSearchable={false}
                                        isClearable={false}
                                        placeholder="Pilih Status"
                                        className="w-full py-1 px-3 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 uppercase">
                            <div className="pb-1 font-bold normal-case text-sm">
                                Pilih Slot Jam
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar rounded-md">
                                <Table
                                    columns={columns}
                                    data={tableData}
                                    renderCell={(col, row) => {
                                        const currentStatus = (
                                            row.status || "Tersedia"
                                        ).toLowerCase();
                                        const isBooked = [
                                            "dipesan",
                                            "booked",
                                        ].includes(currentStatus);

                                        const selectedIds = new Set(
                                            selectedSlots.map((s) => s.id),
                                        );

                                        console.log("row id:", row.id);

                                        switch (col.key) {
                                            case "checkbox":
                                                return (
                                                    <Checkbox
                                                        checked={selectedIds.has(
                                                            row.id,
                                                        )}
                                                        onChange={() =>
                                                            handleSelect(row.id)
                                                        }
                                                        disabled={isBooked}
                                                    />
                                                );
                                            case "status":
                                                return (
                                                    <span className="font-bold min-w-max">
                                                        {row.status ||
                                                            "Tersedia"}
                                                    </span>
                                                );
                                            case "updated_at":
                                                return (
                                                    <span className="text-[11px]">
                                                        {row.updated_at &&
                                                        row.updated_at !== "-"
                                                            ? row.updated_at
                                                            : "-"}
                                                    </span>
                                                );
                                            case "timeSlots":
                                                return (
                                                    <span className="min-w-max">
                                                        {row.timeSlots}
                                                    </span>
                                                );
                                            default:
                                                return row[col.key];
                                        }
                                    }}
                                    getTrProps={(row) => {
                                        const status = (
                                            row.status || "Tersedia"
                                        ).toLowerCase();
                                        let bgClass =
                                            "bg-white dark:bg-secondary-800";

                                        if (
                                            ["dipesan", "booked"].includes(
                                                status,
                                            )
                                        )
                                            bgClass =
                                                "bg-red-100 hover:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 text-secondary-500 dark:text-secondary-400";
                                        if (status.includes("event"))
                                            bgClass =
                                                "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-600 dark:hover:bg-yellow-700";
                                        if (status.includes("pemeliharaan"))
                                            bgClass =
                                                "bg-sky-100 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-700";

                                        return {
                                            className: twMerge(
                                                "transition-colors",
                                                bgClass,
                                            ),
                                        };
                                    }}
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                        <Button
                            variant="primary"
                            size="xs"
                            type="submit"
                            disabled={
                                processing || data.timeslot_ids.length === 0
                            }
                        >
                            Simpan Perubahan
                        </Button>
                        <Button
                            variant="light"
                            size="xs"
                            type="button"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
