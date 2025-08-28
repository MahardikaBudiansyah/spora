// components/Common/BookingSummaryTable.jsx
import React, { useMemo } from "react";
import { NumericFormat } from "react-number-format";
import { formatCustom } from "@/utils/date";

export default function BookingSummaryTable({
    bookingSelections = [],
    fields = [],
    readOnly = false,
    onBookingChange,
    showTotal = true,
}) {
    // Ambil nama lapangan dari id (fallback "Lapangan" kalau tidak ketemu)
    const getFieldName = (fieldId) =>
        fields.find((fld) => fld.id === fieldId)?.name ?? "Lapangan";

    // Hapus slot
    const handleRemoveSlot = (date, fieldId, slotId) => {
        if (readOnly) return;
        onBookingChange?.((prev) =>
            (Array.isArray(prev) ? prev : [])
                .map((d) =>
                    d?.date !== date
                        ? d
                        : {
                              ...d,
                              fields: (Array.isArray(d?.fields) ? d.fields : [])
                                  .map((f) =>
                                      f?.field_id !== fieldId
                                          ? f
                                          : {
                                                ...f,
                                                slots: (Array.isArray(f?.slots)
                                                    ? f.slots
                                                    : []
                                                ).filter(
                                                    (s) =>
                                                        s?.timeslot_id !==
                                                        slotId
                                                ),
                                            }
                                  )
                                  .filter(
                                      (f) =>
                                          Array.isArray(f?.slots) &&
                                          f.slots.length > 0
                                  ),
                          }
                )
                .filter((d) => Array.isArray(d?.fields) && d.fields.length > 0)
        );
    };

    // Subtotal per tanggal
    const getTotalPerDate = (dateEntry) => {
        const fieldsArr = Array.isArray(dateEntry?.fields)
            ? dateEntry.fields
            : [];
        return fieldsArr.reduce((sum, f) => {
            const slotsArr = Array.isArray(f?.slots) ? f.slots : [];
            const fieldTotal = slotsArr.reduce(
                (s, slot) => s + Number(slot?.price || 0),
                0
            );
            return sum + fieldTotal;
        }, 0);
    };

    // Grand total
    const grandTotal = useMemo(() => {
        const dates = Array.isArray(bookingSelections) ? bookingSelections : [];
        return dates.reduce((sum, d) => sum + getTotalPerDate(d), 0);
    }, [bookingSelections]);

    const dates = Array.isArray(bookingSelections) ? bookingSelections : [];

    if (dates.length === 0) {
        return (
            <div className="border rounded-2xl shadow-sm p-4 text-sm text-gray-500">
                Belum ada pilihan jadwal.
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full">
            {dates.map((dateEntry) => {
                const fieldsArr = Array.isArray(dateEntry?.fields)
                    ? dateEntry.fields
                    : [];

                // Skip kalau semua field kosong / tidak ada slot
                const hasAnySlot = fieldsArr.some(
                    (f) => Array.isArray(f?.slots) && f.slots.length > 0
                );
                if (!hasAnySlot) return null;

                const subtotal = getTotalPerDate(dateEntry);

                return (
                    <div
                        key={dateEntry?.date || Math.random()}
                        className="border rounded-2xl shadow-sm p-4"
                    >
                        {/* Judul Tanggal */}
                        <h3 className="font-semibold text-lg mb-4">
                            {formatCustom(
                                dateEntry?.date,
                                "cccc, dd MMMM yyyy"
                            )}
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-left">
                                            Lapangan
                                        </th>
                                        <th className="border p-2 text-left">
                                            Timeslot
                                        </th>
                                        <th className="border p-2 text-right">
                                            Harga
                                        </th>
                                        {!readOnly && (
                                            <th className="border p-2 text-center">
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fieldsArr.map((f) => {
                                        const slotsArr = Array.isArray(f?.slots)
                                            ? f.slots
                                            : [];
                                        if (slotsArr.length === 0) return null;

                                        return slotsArr.map((s, idx) => (
                                            <tr
                                                key={`${dateEntry?.date}-${f?.field_id}-${s?.timeslot_id}`}
                                            >
                                                {idx === 0 && (
                                                    <td
                                                        rowSpan={
                                                            slotsArr.length
                                                        }
                                                        className="border p-2 align-top font-medium"
                                                    >
                                                        {getFieldName(
                                                            f?.field_id
                                                        )}
                                                    </td>
                                                )}
                                                <td className="border p-2">
                                                    {s?.name ?? "-"}
                                                </td>
                                                <td className="border p-2 text-right">
                                                    <NumericFormat
                                                        value={Number(
                                                            s?.price || 0
                                                        )}
                                                        displayType="text"
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        prefix="Rp "
                                                    />
                                                </td>
                                                {!readOnly && (
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:underline text-sm"
                                                            onClick={() =>
                                                                handleRemoveSlot(
                                                                    dateEntry?.date,
                                                                    f?.field_id,
                                                                    s?.timeslot_id
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ));
                                    })}

                                    {/* Subtotal per tanggal */}
                                    {showTotal && (
                                        <tr className="bg-gray-50 font-semibold">
                                            <td
                                                colSpan={2}
                                                className="border p-2 text-right"
                                            >
                                                Subtotal
                                            </td>
                                            <td className="border p-2 text-right">
                                                <NumericFormat
                                                    value={subtotal}
                                                    displayType="text"
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="Rp "
                                                />
                                            </td>
                                            {!readOnly && (
                                                <td className="border p-2" />
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}

            {/* Grand total */}
            {showTotal && grandTotal > 0 && (
                <div className="border rounded-2xl shadow p-4 bg-gray-50 font-bold text-right">
                    Grand Total:{" "}
                    <NumericFormat
                        value={grandTotal}
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                    />
                </div>
            )}
        </div>
    );
}
