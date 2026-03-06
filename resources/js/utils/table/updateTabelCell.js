// utils/table/updateTableCell.js

/**
 * Update value pada cell tertentu di tabel
 * @param {Array} rows - array row (tabel data)
 * @param {string|number} rowId - id row yang akan diupdate
 * @param {string} fieldKey - key dari cell
 * @param {any} value - nilai baru
 * @returns {Array} - array rows baru
 */
export function updateTableCell(rows, rowId, fieldKey, value) {
    return rows.map((row) =>
        row.id === rowId
            ? {
                  ...row,
                  [fieldKey]: value,
              }
            : row
    );
}

/**
 * Update multiple cells sekaligus
 * @param {Array} rows
 * @param {string|number} rowId
 * @param {Object} newValues - { fieldKey: value }
 * @returns {Array}
 */
export function updateTableCells(rows, rowId, newValues) {
    return rows.map((row) =>
        row.id === rowId
            ? {
                  ...row,
                  ...newValues,
              }
            : row
    );
}
