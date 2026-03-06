export const BUSINESS_TYPE_MAP = {
    individual: "Perseorangan",
    entity: "Badan Usaha",
};

export function formatBusinessType(type) {
    if (!type) return "-";
    return BUSINESS_TYPE_MAP[type.toLowerCase()] || type;
}

export const getBusinessTypeOptions = () => {
    return Object.entries(BUSINESS_TYPE_MAP).map(([value, label]) => ({
        value,
        label,
    }));
};
