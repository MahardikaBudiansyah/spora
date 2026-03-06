export const GENDER_MAP = {
    male: "Laki-laki",
    female: "Perempuan",
};

export function formatGender(gender) {
    if (!gender) return "-";
    return GENDER_MAP[gender.toLowerCase()] || gender;
}

export const getGenderOptions = () => {
    return Object.entries(GENDER_MAP).map(([value, label]) => ({
        value,
        label,
    }));
};
