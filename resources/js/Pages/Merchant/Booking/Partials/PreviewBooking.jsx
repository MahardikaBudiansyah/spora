import { formatCustom } from "@/utils/date";
import { DotIcon } from "lucide-react";

export default function PreviewBooking({
    bookingSelections = [],
    fields = [],
    onBookingChange,
    readOnly = false, // default: bisa edit
}) {
    const handleRemoveSlot = (date, fieldId, slotId) => {
        if (readOnly) return;
        onBookingChange?.((prev) =>
            prev
                .map((d) =>
                    d.date !== date
                        ? d
                        : {
                              ...d,
                              fields: d.fields
                                  .map((f) =>
                                      f.field_id !== fieldId
                                          ? f
                                          : {
                                                ...f,
                                                slots: f.slots.filter(
                                                    (s) =>
                                                        s.timeslot_id !== slotId
                                                ),
                                            }
                                  )
                                  .filter((f) => f.slots.length > 0),
                          }
                )
                .filter((d) => d.fields.length > 0)
        );
    };

    const getFieldName = (fieldId) =>
        fields.find((fld) => fld.id === fieldId)?.name ?? "Lapangan";

    const getTotalPerDate = (dateEntry) =>
        dateEntry.fields.reduce(
            (sum, f) =>
                sum +
                f.slots.reduce((s, slot) => s + Number(slot.price || 0), 0),
            0
        );

    const totalKeseluruhan = bookingSelections.reduce(
        (sum, d) => sum + getTotalPerDate(d),
        0
    );

    return (
        <div className="flex flex-col w-full text-left">
            <div className="pb-4 text-xl text-secondary-500 dark:text-white font-bold uppercase">
                Ringkasan Booking
            </div>

            {bookingSelections.map((b) => {
                const totalPerDate = getTotalPerDate(b);

                return (
                    <div key={b.date} className="mb-4">
                        {/* Tanggal */}
                        <div className="pt-2 pb-2 font-semibold">
                            {formatCustom(b.date, "cccc, dd MMMM yyyy")}
                        </div>

                        {/* Fields */}
                        {b.fields.map((f) => (
                            <div key={f.field_id} className="ml-2 mb-3">
                                <div className="font-medium">
                                    {getFieldName(f.field_id)}
                                </div>

                                <ul className="list-disc ml-4">
                                    {f.slots.map((s) => (
                                        <li
                                            key={s.timeslot_id}
                                            className="flex justify-between items-center"
                                        >
                                            <div className="flex items-center">
                                                <span>{s.name}</span>
                                                <DotIcon className="w-5" />
                                                Rp{" "}
                                                {Number(
                                                    s.price || 0
                                                ).toLocaleString("id-ID")}
                                            </div>
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:underline ml-2 text-sm"
                                                    onClick={() =>
                                                        handleRemoveSlot(
                                                            b.date,
                                                            f.field_id,
                                                            s.timeslot_id
                                                        )
                                                    }
                                                >
                                                    [Hapus]
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Subtotal per Tanggal */}
                        <div className="pt-2 pb-2 border-y font-bold text-base text-right">
                            Sub Total: Rp {totalPerDate.toLocaleString("id-ID")}
                        </div>
                    </div>
                );
            })}

            {/* Total Semua */}
            <div className="mt-2 text-base text-right font-bold">
                Total Keseluruhan: Rp {totalKeseluruhan.toLocaleString("id-ID")}
            </div>
        </div>
    );
}
