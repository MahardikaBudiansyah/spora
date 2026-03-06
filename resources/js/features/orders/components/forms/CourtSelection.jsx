import { useMemo } from "react";
import { formatWithPattern, formatFullDate } from "@/utils/date";
import { NumericFormat } from "react-number-format";
import DatePickerInput from "@/components/Common/DatePickerInput";
import Table from "@/components/Common/Table";
import Checkbox from "@/components/Common/Checkbox";
import SelectInput from "@/components/Common/SelectInput";
import { toast } from "react-toastify";
import LabelInput from "@/components/Common/LabelInput";
import ErrorInput from "@/components/Common/ErrorInput";
import { Calendar } from "lucide-react";
import Badge from "@/components/Common/Badge";
import { getDayType } from "@/utils/attributes/courtAttribute";

const columns = [
    { key: "checkbox", header: "", className: "text-center w-10" },
    {
        key: "time_range",
        header: "SLOT JAM",
        className: "text-center whitespace-nowrap min-w-max",
    },
    {
        key: "price",
        header: "HARGA",
        className: "text-center whitespace-nowrap min-w-max",
    },
    {
        key: "status",
        header: "STATUS",
        className: "text-center whitespace-nowrap min-w-max",
    },
];

export default function CourtSelection({
    courts = {},
    selectedCourtId,
    setSelectedCourtId,
    selectedDate,
    setSelectedDate,
    bookingSelections,
    onBookingChange,
    errors,
}) {
    const courtsArray = useMemo(() => {
        if (Array.isArray(courts)) return courts;
        if (Array.isArray(courts?.data)) return courts.data;
        return [];
    }, [courts]);

    const timeslots = useMemo(() => {
        if (!selectedCourtId || courtsArray.length === 0) return [];
        const found = courtsArray.find((c) => c.id === selectedCourtId);
        return found?.timeslots || [];
    }, [courtsArray, selectedCourtId]);

    const courtOptions = useMemo(() => {
        return courtsArray.map((c) => ({
            value: c.id,
            label: `${c.name} - ${c.court_surface}`,
        }));
    }, [courtsArray]);

    const selectedCourt = useMemo(() => {
        return courtsArray.find((c) => c.id === selectedCourtId) || null;
    }, [courtsArray, selectedCourtId]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const handleSelectSlot = (slot) => {
        if (!selectedDate) return toast.warning("Silakan pilih tanggal...");

        const checkDate = new Date(selectedDate);
        checkDate.setHours(0, 0, 0, 0);
        if (checkDate < today) {
            return toast.error(
                "Tidak dapat memilih jadwal di tanggal yang sudah lewat.",
            );
        }

        if (!slot.is_available && slot.status !== "Dipilih") {
            return toast.warning(
                `Slot ini tidak tersedia (Status: ${slot.status})`,
            );
        }
        onBookingChange((prev) => {
            const currentSelections = Array.isArray(prev) ? prev : [];
            const newPrev = [...currentSelections];

            const date = formatWithPattern(selectedDate, "yyyy-MM-dd");
            const dateIndex = newPrev.findIndex((d) => d.date === date);

            const activeCourtId = Number(selectedCourtId);

            const slotToStore = {
                id: slot.id,
                timeslot_id: slot.id,
                start_time: slot.start_time,
                end_time: slot.end_time,
                price: slot.price,
                status: "Dipilih",
            };

            if (dateIndex === -1) {
                newPrev.push({
                    date,
                    courts: [
                        {
                            court_id: activeCourtId,
                            court_name: selectedCourt?.name,
                            slots: [slotToStore],
                        },
                    ],
                });
                return newPrev;
            }

            const dateEntry = newPrev[dateIndex];
            const courtIndex = dateEntry.courts.findIndex(
                (c) => c.court_id === selectedCourtId,
            );

            if (courtIndex === -1) {
                dateEntry.courts.push({
                    court_id: selectedCourtId,
                    court_name: selectedCourt?.name,
                    court_surface: selectedCourt?.court_surface,
                    slots: [slotToStore],
                });
            } else {
                const courtEntry = dateEntry.courts[courtIndex];
                const slotIndex = courtEntry.slots.findIndex(
                    (s) => s.id === slot.id,
                );

                if (slotIndex === -1) {
                    courtEntry.slots.push(slotToStore);
                } else {
                    courtEntry.slots.splice(slotIndex, 1);
                    if (!courtEntry.slots.length)
                        dateEntry.courts.splice(courtIndex, 1);
                }
            }

            if (!dateEntry.courts.length) newPrev.splice(dateIndex, 1);
            return newPrev;
        });
    };

    const tableData = useMemo(() => {
        const safeSelections = Array.isArray(bookingSelections)
            ? bookingSelections
            : [];

        if (!selectedDate || !timeslots) return [];

        const dateKey = formatWithPattern(selectedDate, "yyyy-MM-dd");

        return timeslots.map((slot) => {
            const isSelected = safeSelections.some(
                (d) =>
                    d.date === dateKey &&
                    Array.isArray(d.courts) &&
                    d.courts.some(
                        (c) =>
                            c.court_id === selectedCourtId &&
                            Array.isArray(c.slots) &&
                            c.slots.some((s) => s.id === slot.id),
                    ),
            );

            return {
                ...slot,
                time_range: `${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}`,
                status: isSelected ? "Dipilih" : slot.status,
            };
        });
    }, [selectedDate, timeslots, bookingSelections, selectedCourtId]);

    const dayTypeInfo = useMemo(() => {
        if (tableData && tableData.length > 0) {
            const rawType = tableData[0].day_type;

            return getDayType(rawType);
        }
        return null;
    }, [tableData]);

    return (
        <div className="flex flex-col w-full text-left">
            <div className="space-y-4">
                <div className="w-full space-y-2 border-b border-secondary-100 dark:border-secondary-800 text-left">
                    <LabelInput
                        htmlFor="selectedCourtId"
                        value="Pilih Lapangan:"
                    />

                    <SelectInput
                        value={selectedCourtId}
                        options={courtOptions}
                        onChange={(val) => setSelectedCourtId(Number(val))}
                        isClearable={false}
                        isSearchable={false}
                    />
                    {errors?.selectedCourtId && (
                        <ErrorInput
                            message={errors.selectedCourtId}
                            className="mt-1"
                        />
                    )}
                </div>

                <div className=" space-y-2 border-b border-secondary-100 dark:border-secondary-800 text-left">
                    <LabelInput value="Pilih Tanggal:" />

                    <DatePickerInput
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Pilih Tanggal Booking"
                        minDate={today}
                    />
                    {errors?.selectedDate && (
                        <ErrorInput
                            message={errors.selectedDate}
                            className="mt-1"
                        />
                    )}
                </div>

                <div className="w-full space-y-2 border-b border-secondary-100 dark:border-secondary-800 text-left">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <LabelInput value="Pilih Jadwal:" />
                        <div className="flex flex-row items-center gap-2">
                            {selectedDate && (
                                <span className="flex gap-2 items-center text-xs font-semibold text-primary-600 ">
                                    <Calendar className="w-3.5 h-3.5" />{" "}
                                    {formatFullDate(selectedDate)}
                                </span>
                            )}
                            {dayTypeInfo && (
                                <Badge color={dayTypeInfo.color}>
                                    {dayTypeInfo.label}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="max-h-60 w-full overflow-auto custom-scrollbar rounded-md">
                        <Table
                            columns={columns}
                            data={tableData}
                            renderCell={(col, row) => {
                                if (col.key === "checkbox") {
                                    const canBeSelected =
                                        row.is_available ||
                                        row.status === "Dipilih";
                                    return (
                                        <Checkbox
                                            checked={row.status === "Dipilih"}
                                            onChange={() =>
                                                handleSelectSlot(row)
                                            }
                                            disabled={!canBeSelected}
                                        />
                                    );
                                }
                                if (col.key === "price") {
                                    return (
                                        <NumericFormat
                                            value={row.price}
                                            displayType="text"
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="Rp "
                                        />
                                    );
                                }
                                return row[col.key];
                            }}
                            getTrProps={(row) => {
                                const classes = {
                                    Tersedia: "bg-white dark:bg-secondary-800",
                                    Dipilih:
                                        "bg-primary-100 hover:bg-primary-200 dark:bg-primary-600 dark:hover:bg-primary-700",
                                    Dipesan:
                                        "bg-red-100 hover:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 text-secondary-500 dark:text-secondary-400",
                                    Event: "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-secondary-400 dark:text-secondary-400",
                                    Pemeliharaan:
                                        "bg-sky-100 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-700 text-secondary-400 dark:text-secondary-400",
                                };
                                return {
                                    className:
                                        classes[row.status] ||
                                        "bg-white dark:bg-secondary-900",
                                };
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
