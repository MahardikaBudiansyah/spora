// components/Common/OrderSummaryTable.jsx
import React, { useMemo } from "react";
import { NumericFormat } from "react-number-format";
import IconButton from "@/components/Common/IconButton";
import { Trash2 } from "lucide-react";

export default function OrderSummaryTable({
    groups = [],
    columns = [],
    readOnly = false,
    showTotal = true,
    onRemove,
    getGroupLabel = (g) => g?.label,
    getGroupSubtotal = (g) => 0,
    getItemKey = (g, f, i) => Math.random(),
}) {
    const safeArr = (arr) => (Array.isArray(arr) ? arr : []);

    const grandTotal = useMemo(() => {
        return safeArr(groups).reduce((sum, g) => sum + getGroupSubtotal(g), 0);
    }, [groups]);

    if (safeArr(groups).length === 0) {
        return (
            <div className="border rounded border-secondary-200 dark:border-secondary-700 shadow-sm m-1 p-4 text-sm text-secondary-700 dark:text-secondary-400">
                Tidak ada data.
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full">
            {groups.map((group) => {
                const groupLabel = getGroupLabel(group);
                const courts = safeArr(group.courts);

                return (
                    <div key={groupLabel} className="p-1">
                        {/* Judul group (tanggal / judul paket) */}
                        {groupLabel && (
                            <h3 className="font-semibold text-lg mb-4">
                                {groupLabel}
                            </h3>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-secondary-200 dark:border-secondary-600 text-sm">
                                <thead className="bg-secondary-100 dark:bg-secondary-700 text-center">
                                    <tr>
                                        {columns.map((col, idx) => (
                                            <th
                                                key={idx}
                                                className="border border-secondary-200 dark:border-secondary-600 p-2"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                        {!readOnly && (
                                            <th className="border border-secondary-200 dark:border-secondary-600 p-2">
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {courts.map((f) => {
                                        const items = safeArr(f.items);
                                        if (items.length === 0) return null;

                                        return items.map((item, idx) => (
                                            <tr
                                                key={getItemKey(group, f, item)}
                                            >
                                                {columns.map((col, cIdx) => {
                                                    const content = col.render(
                                                        group,
                                                        f,
                                                        item
                                                    );

                                                    // rowspan logic support
                                                    const cellProps =
                                                        col.rowSpan && idx === 0
                                                            ? {
                                                                  rowSpan:
                                                                      items.length,
                                                              }
                                                            : col.rowSpan
                                                            ? { hidden: true }
                                                            : {};

                                                    return (
                                                        <td
                                                            key={cIdx}
                                                            {...cellProps}
                                                            className={`border border-secondary-200 dark:border-secondary-600 p-2 ${
                                                                col.align ===
                                                                "right"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {content}
                                                        </td>
                                                    );
                                                })}

                                                {!readOnly && (
                                                    <td className="border border-secondary-200 dark:border-secondary-600 p-2 text-center">
                                                        <IconButton
                                                            tooltip="Hapus"
                                                            onClick={() =>
                                                                onRemove?.(
                                                                    group,
                                                                    f,
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
                                                        </IconButton>
                                                    </td>
                                                )}
                                            </tr>
                                        ));
                                    })}

                                    {/* Subtotal per group */}
                                    {showTotal && (
                                        <tr className="bg-gray-100 dark:bg-secondary-700 font-semibold">
                                            <td
                                                colSpan={columns.length - 1}
                                                className="border border-secondary-200 dark:border-secondary-600 p-2 text-right"
                                            >
                                                Sub Total
                                            </td>
                                            <td className="border border-secondary-200 dark:border-secondary-600 p-2 text-right">
                                                <NumericFormat
                                                    value={getGroupSubtotal(
                                                        group
                                                    )}
                                                    displayType="text"
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="Rp "
                                                />
                                            </td>
                                            {!readOnly && (
                                                <td className="border border-secondary-200 dark:border-secondary-600 p-2"></td>
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}

            {showTotal && grandTotal > 0 && (
                <div className="border rounded border-secondary-200 dark:border-secondary-600 m-1 p-2 bg-gray-100 dark:bg-secondary-700 font-bold text-right">
                    Jumlah Keseluruhan:{" "}
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
