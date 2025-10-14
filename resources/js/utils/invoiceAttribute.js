export const invoiceStatusMap = {
    unpaid: { label: "Belum Dibayar", color: "red" },
    partial: { label: "Dibayar DP", color: "yellow" },
    paid: { label: "Dibayar", color: "green" },
};

export const getInvoiceStatus = (status) =>
    invoiceStatusMap[status] || { label: status, color: "gray" };
