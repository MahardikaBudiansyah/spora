export const paymentStatusMap = {
    pending: { label: "Menunggu", color: "yellow" },
    paid: { label: "Dibayar", color: "green" },
    failed: { label: "Gagal", color: "red" },
    refunded: { label: "Dikembalikan", color: "blue" },
};

export const getPaymentStatus = (status) =>
    paymentStatusMap[status] || { label: status, color: "gray" };

export const paymentMethodMap = {
    cash: { label: "Tunai", color: "blue" },
    transfer: { label: "Transfer", color: "green" },
    gateway: { label: "Gateway", color: "orange" },
};

export const getPaymentMethod = (method) => paymentMethodMap[method] || method;

export const paymentTypeMap = {
    down_payment: { label: "DP", color: "yellow" },
    full_payment: { label: "Lunas", color: "green" },
};

export const getPaymentType = (type) =>
    paymentTypeMap[type] || { label: status, color: "gray" };
