import { twMerge } from "tailwind-merge";
import Spinner from "@/components/common/Spinner";

/**
 * Reusable Table component with per-cell and per-row customization.
 *
 * Props:
 * - columns: [ { key, header, render?, className?, headerClassName?, getTdClassName? } ]
 * - data: array of row data
 * - wrapperClassName, tableClassName, emptyState, isLoading
 * - renderCell?: override full cell render
 * - getTrProps?: (row, rowIndex) => { className?, ... }
 * - getTdProps?: (col, row) => { className?, ... }
 * - rowKey?: (row) => unique key for row (default = rowIndex)
 */

export default function Table({
    columns = [],
    data = [],
    children,
    wrapperClassName = "",
    tableClassName = "",
    emptyState = null,
    isLoading = false,
    renderCell,
    getTrProps = () => ({}),
    getTdProps = () => ({}),
    rowKey, // <--- baru
}) {
    const defaultWrapperClass =
        "overflow-x-auto overflow-y-auto bg-white border border-secondary-200 rounded-lg shadow dark:bg-secondary-900 dark:border-secondary-700";

    const defaultTableClass =
        "min-w-full text-xs text-left text-gray-700 dark:text-gray-200";

    return (
        <div className={twMerge(defaultWrapperClass, wrapperClassName)}>
            <table className={twMerge(defaultTableClass, tableClassName)}>
                {children}
                <thead className="bg-secondary-100 dark:bg-secondary-700">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={twMerge(
                                    "px-4 py-3 font-bold text-center",
                                    col.headerClassName
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="py-6 text-center"
                            >
                                <Spinner size="md" />
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="py-6 text-center text-gray-400"
                            >
                                {emptyState || "Tidak ada data"}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => {
                            const key = rowKey ? rowKey(row) : rowIndex;
                            const { className: trClassName, ...trProps } =
                                getTrProps(row, rowIndex) || {};
                            return (
                                <tr
                                    key={key} // <--- gunakan key unik
                                    className={twMerge(
                                        "hover:bg-secondary-50 dark:hover:bg-secondary-600",
                                        trClassName
                                    )}
                                    {...trProps}
                                >
                                    {columns.map((col) => {
                                        const cellValue = row[col.key];
                                        const cellClass =
                                            typeof col.getTdClassName ===
                                            "function"
                                                ? col.getTdClassName(
                                                      cellValue,
                                                      row
                                                  )
                                                : "";
                                        const {
                                            className: tdClassName,
                                            ...tdProps
                                        } = getTdProps(col, row) || {};

                                        return (
                                            <td
                                                key={col.key}
                                                className={twMerge(
                                                    "px-4 py-3 content-start",
                                                    col.className,
                                                    cellClass,
                                                    tdClassName
                                                )}
                                                {...tdProps}
                                            >
                                                {renderCell
                                                    ? renderCell(col, row)
                                                    : typeof col.render ===
                                                      "function"
                                                    ? col.render(
                                                          cellValue,
                                                          row,
                                                          rowIndex
                                                      )
                                                    : typeof cellValue ===
                                                      "object"
                                                    ? JSON.stringify(cellValue)
                                                    : cellValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
