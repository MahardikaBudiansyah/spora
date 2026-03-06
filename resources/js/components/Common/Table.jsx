import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "@/components/common/Spinner";

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
    rowKey,
    renderExpandRow,
    expandedRowKeys = [],
    footer = null,
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
                                scope="col"
                                className={twMerge(
                                    "px-4 py-3 font-bold text-center uppercase",
                                    col.headerClassName,
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
                            const key = rowKey
                                ? rowKey(row)
                                : (row.id ?? rowIndex);

                            const { className: trClassName, ...trProps } =
                                getTrProps(row, rowIndex) || {};

                            return (
                                <React.Fragment key={key}>
                                    <tr
                                        className={twMerge(
                                            "hover:bg-secondary-50 dark:hover:bg-secondary-600",
                                            trClassName,
                                        )}
                                        {...trProps}
                                    >
                                        {columns.map((col) => {
                                            const cellValue = row[col.key];

                                            let content =
                                                typeof col.render === "function"
                                                    ? col.render(
                                                          cellValue,
                                                          row,
                                                          rowIndex,
                                                      )
                                                    : typeof cellValue ===
                                                            "object" &&
                                                        cellValue !== null
                                                      ? ""
                                                      : cellValue;

                                            const isEmpty =
                                                content === null ||
                                                content === undefined ||
                                                content === "";

                                            const forceCenter =
                                                isEmpty &&
                                                !col.className?.includes(
                                                    "text-",
                                                );

                                            const {
                                                className: tdClassName,
                                                ...tdProps
                                            } = getTdProps(col, row) || {};

                                            const cellClass =
                                                typeof col.getTdClassName ===
                                                "function"
                                                    ? col.getTdClassName(
                                                          cellValue,
                                                          row,
                                                      )
                                                    : "";

                                            return (
                                                <td
                                                    key={col.key}
                                                    className={twMerge(
                                                        "px-4 py-3",
                                                        col.className, // Alignment dari definisi kolom (misal: text-right)
                                                        tdClassName, // Class dari props dinamis
                                                        cellClass, // Class dari logic kolom
                                                        forceCenter &&
                                                            "text-center", // Override ke tengah hanya jika data kosong
                                                    )}
                                                    {...tdProps}
                                                >
                                                    {isEmpty ? "-" : content}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {renderExpandRow &&
                                        expandedRowKeys.includes(key) && (
                                            <tr className="bg-gray-50 dark:bg-secondary-800">
                                                <td
                                                    colSpan={columns.length}
                                                    className="p-0"
                                                >
                                                    {renderExpandRow(
                                                        row,
                                                        rowIndex,
                                                        true,
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>

                {footer && (
                    <tfoot className="bg-secondary-50 dark:bg-secondary-800 font-semibold text-sm">
                        {footer}
                    </tfoot>
                )}
            </table>
        </div>
    );
}
