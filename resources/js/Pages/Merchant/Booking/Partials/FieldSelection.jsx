import { useMemo } from "react";
import { formatCustom } from "@/utils/date";
import { NumericFormat } from "react-number-format";
import DatePickerInput from "@/components/common/DatePickerInput";
import Table from "@/components/Common/Table";
import Checkbox from "@/components/Common/Checkbox";
import SelectInput from "@/components/Common/SelectInput";
import { toast } from "react-toastify";

const columns = [
    { key: "checkbox", header: "", className: "text-center" },
    { key: "timeSlots", header: "SLOT JAM", className: "text-center" },
    { key: "price", header: "HARGA", className: "text-center" },
    { key: "status", header: "STATUS", className: "text-center" },
    { key: "information", header: "KETERANGAN", className: "text-center" },
];

export default function FieldSelection({
    venue,
    fields,
    selectedFieldId,
    setSelectedFieldId,
    selectedDate,
    setSelectedDate,
    bookingSelections,
    onBookingChange,
    timeslots = [], // 👈 ambil dari parent
}) {
    const selectedField = fields.find((f) => f.id === selectedFieldId);

    /** =========================
     * Handler Select Slot
     * ========================= */
    const handleSelectSlot = (slot) => {
        if (!selectedDate)
            return toast.warning("Silakan pilih tanggal terlebih dahulu.");
        if (!selectedFieldId)
            return toast.warning("Silakan pilih lapangan terlebih dahulu.");

        const date = formatCustom(selectedDate, "yyyy-MM-dd");

        if (!slot || slot.status_label !== "Tersedia") {
            return toast.warning("Slot ini tidak bisa dipilih.");
        }

        const slotWithStatus = {
            ...slot,
            field_id: selectedFieldId,
            booking_date: date,
            status: "selected",
        };

        onBookingChange((prev) => {
            const newPrev = [...prev];
            const dateIndex = newPrev.findIndex((d) => d.date === date);

            if (dateIndex === -1) {
                newPrev.push({
                    date,
                    fields: [
                        {
                            field_id: selectedFieldId,
                            field_type: selectedField?.field_type,
                            slots: [slotWithStatus],
                        },
                    ],
                });
                return newPrev;
            }

            const dateEntry = newPrev[dateIndex];
            const fieldIndex = dateEntry.fields.findIndex(
                (f) => f.field_id === selectedFieldId
            );

            if (fieldIndex === -1) {
                dateEntry.fields.push({
                    field_id: selectedFieldId,
                    field_type: selectedField?.field_type,
                    slots: [slotWithStatus],
                });
            } else {
                const fieldEntry = dateEntry.fields[fieldIndex];
                const slotIndex = fieldEntry.slots.findIndex(
                    (s) => s.timeslot_id === slot.timeslot_id
                );

                if (slotIndex === -1) {
                    fieldEntry.slots.push(slotWithStatus);
                } else {
                    fieldEntry.slots.splice(slotIndex, 1);
                    if (!fieldEntry.slots.length)
                        dateEntry.fields.splice(fieldIndex, 1);
                }
            }

            if (!dateEntry.fields.length) newPrev.splice(dateIndex, 1);

            return newPrev;
        });
    };

    /** =========================
     * Memoized Data
     * ========================= */
    const selectedDateFormatted = useMemo(
        () =>
            selectedDate
                ? formatCustom(selectedDate, "cccc, dd MMMM yyyy")
                : "-",
        [selectedDate]
    );

    const options = useMemo(
        () =>
            fields.map((f) => ({
                value: f.id,
                label: `${f.name} - ${f.field_type}`,
            })),
        [fields]
    );

    const tableData = useMemo(() => {
        if (!selectedDate || !timeslots) return [];
        return timeslots.map((slot) => {
            const isSelected = bookingSelections.some(
                (d) =>
                    d.date === formatCustom(selectedDate, "yyyy-MM-dd") &&
                    d.fields.some(
                        (f) =>
                            f.field_id === selectedFieldId &&
                            f.slots.some(
                                (s) => s.timeslot_id === slot.timeslot_id
                            )
                    )
            );

            return {
                ...slot, // 👈 bawa semua data asli slot
                timeSlots: slot.name,
                price: slot.price,
                status: isSelected ? "selected" : slot.status_label,
                information: slot.information || "-",
            };
        });
    }, [selectedDate, timeslots, bookingSelections, selectedFieldId]);

    /** =========================
     * Render
     * ========================= */
    return (
        <div className="flex flex-col w-full text-left">
            <div className="pb-4 text-xl text-secondary-500 dark:text-white font-bold uppercase">
                Informasi Lapangan
            </div>
            <div className="py-2 text-lg font-semibold">
                {venue?.name ?? "-"}
            </div>

            {/* Pilih Field */}
            <div className="py-2 flex flex-col md:flex-row gap-2">
                <div className="md:w-1/4 flex flex-row md:justify-between gap-2 items-center">
                    <span className="font-bold">Nama Lapangan</span>
                    <span>:</span>
                </div>
                <div className="flex-1 w-full">
                    <SelectInput
                        id="field_id"
                        name="field_id"
                        value={selectedFieldId}
                        options={options}
                        onChange={(val) => setSelectedFieldId(Number(val))}
                        placeholder="Pilih Lapangan"
                        isClearable={false}
                        isSearchable={false}
                        className="py-0 px-3"
                    />
                </div>
            </div>

            {/* Pilih Tanggal */}
            <div className="py-2 flex flex-col md:flex-row gap-2">
                <div className="md:w-1/4 flex flex-row md:justify-between gap-2 items-center">
                    <span className="font-bold">Tanggal Main</span>
                    <span>:</span>
                </div>
                <div className="flex flex-1 flex-row gap-2 items-center">
                    <span>{selectedDateFormatted}</span>
                    <div className="flex-1">
                        <DatePickerInput
                            label=""
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder="Pilih tanggal"
                        />
                    </div>
                </div>
            </div>

            {/* Pilih Slot */}
            <div className="py-2 flex flex-col gap-2">
                <div className="md:w-1/4 flex flex-row md:justify-between gap-2 items-center">
                    <span className="font-bold">Pilih Waktu Main</span>
                    <span className="ml-2">:</span>
                </div>
                <div className="flex-1 max-h-64 w-full overflow-y-auto custom-scrollbar">
                    <Table
                        columns={columns}
                        data={tableData}
                        renderCell={(col, row) => {
                            if (col.key === "checkbox") {
                                const isAvailable =
                                    row.status === "Tersedia" ||
                                    row.status === "selected";
                                const isChecked = row.status === "selected";
                                return (
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={() => handleSelectSlot(row)}
                                        disabled={!isAvailable}
                                        className={
                                            isAvailable
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed"
                                        }
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
                                        decimalScale={0}
                                    />
                                );
                            }
                            return (
                                row[col.key] ||
                                (col.key === "information" ? "-" : null)
                            );
                        }}
                        getTrProps={(row) => {
                            const status = row.status;
                            const classes = {
                                Tersedia:
                                    "bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-900 font-semibold",
                                selected:
                                    "bg-green-100 dark:bg-green-300 border-green-200 dark:border-green-400 hover:bg-green-200 dark:hover:bg-green-400 font-semibold",
                                Dipesan:
                                    "bg-rose-100 dark:bg-rose-300 border-rose-200 dark:border-rose-400 dark:text-gray-900 hover:bg-rose-200 dark:hover:bg-rose-400 font-semibold",
                                Event: "bg-yellow-100 dark:bg-yellow-300 border-yellow-200 dark:border-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-400 dark:text-gray-900 font-semibold",
                                Pemeliharaan:
                                    "bg-sky-100 dark:bg-sky-300 border-sky-200 dark:border-sky-400 hover:bg-sky-200 dark:hover:bg-sky-400 dark:text-gray-900 font-semibold",
                            };
                            return { className: classes[status] || "" };
                        }}
                        getTdProps={(col, row) =>
                            col.key === "information" && !row.information
                                ? { className: "text-gray-400 italic" }
                                : {}
                        }
                        wrapperClassName="rounded-none border-none w-full"
                    />
                </div>
            </div>
        </div>
    );
}
