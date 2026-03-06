import InlineEditingCell from "./InlineEditingCell";

export default function InlineEditingRow({
    row,
    columns,
    rowIndex,
    tempValues,
    handleChange,
    handleBlur,
    focusedRow,
    focusedField,
    setFocusedRow,
    setFocusedField,
    savingCell,
    successCell,
    errorCell,
}) {
    return (
        <tr className="inline-editing-row">
            {columns.map((col) => {
                const cellKey = `${row.id}-${col.key}`;
                const value = tempValues[cellKey] ?? row[col.key] ?? "";

                if (col.editable) {
                    return (
                        <InlineEditingCell
                            key={col.key}
                            value={value}
                            col={col}
                            row={row}
                            rowIndex={rowIndex}
                            focusedRow={focusedRow}
                            focusedField={focusedField}
                            setFocusedRow={setFocusedRow}
                            setFocusedField={setFocusedField}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            savingCell={savingCell}
                            successCell={successCell}
                            errorCell={errorCell}
                        />
                    );
                }

                return <td key={col.key}>{row[col.key]}</td>;
            })}
        </tr>
    );
}
