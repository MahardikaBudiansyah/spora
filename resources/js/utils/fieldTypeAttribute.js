export const getFieldType = (typeId) => {
    switch (typeId) {
        case 1:
            return { label: "Vinyl", color: "blue" };
        case 2:
            return { label: "Rumput Sintetis", color: "green" };
        case 3:
            return { label: "Semen/ Beton", color: "orange" };
        case 4:
            return { label: "Parquette", color: "red" };
        case 5:
            return { label: "Taraflex", color: "yellow" };
        case 6:
            return { label: "Karper Plastik", color: "teal" };
        default:
            return { label: "Tidak Diketahui", color: "gray" };
    }
};
