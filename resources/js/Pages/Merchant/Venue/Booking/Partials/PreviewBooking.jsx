import IconButton from "@/components/Common/IconButton";
import { formatWithPattern } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { DotIcon, Trash2 } from "lucide-react";

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
        (dateEntry.fields ?? []).reduce(
            (sum, f) =>
                sum +
                (f.slots ?? []).reduce(
                    (s, slot) => s + Number(slot.price || 0),
                    0
                ),
            0
        );

    const totalKeseluruhan = (bookingSelections ?? []).reduce(
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
                        <div className="pt-2 pb-2 uppercase font-semibold">
                            {formatWithPattern(b.date, "cccc, d MMMM yyyy")}
                        </div>

                        {/* Fields */}
                        {b.fields.map((f) => (
                            <div key={f.field_id} className="mb-3">
                                <div className="font-medium">
                                    {getFieldName(f.field_id)}
                                </div>

                                <ul className="list-disc space-y-2 py-2">
                                    {f.slots.map((s) => (
                                        <li
                                            key={s.timeslot_id}
                                            className="px-4 py-2 flex justify-between items-center border-l-4 mb-2 bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900 rounded-md text-sm "
                                        >
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="font-bold">
                                                    {s.name}
                                                </span>
                                                {formatRupiah(s.price)}
                                            </div>
                                            {!readOnly && (
                                                <IconButton
                                                    tooltip="Hapus"
                                                    onClick={() =>
                                                        handleRemoveSlot(
                                                            b.date,
                                                            f.field_id,
                                                            s.timeslot_id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-5 h-5 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer" />
                                                </IconButton>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Subtotal per Tanggal */}
                        <div className="pt-2 pb-2 border-y border-secondary-300 dark:border-secondary-500 font-bold text-base text-right">
                            Sub Total: {formatRupiah(totalPerDate)}
                        </div>
                    </div>
                );
            })}

            {/* Total Semua */}
            <div className="mt-2 text-base text-right font-bold">
                Total Keseluruhan: {formatRupiah(totalKeseluruhan)}
            </div>
        </div>
    );
}
