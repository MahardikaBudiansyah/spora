export const getCourtSurface = (typeName) => {
    const name = typeName?.toLowerCase() || "";

    switch (name) {
        case "vinyl":
            return { label: "Vinyl", color: "blue" };
        case "rumput sintetis":
            return { label: "Rumput Sintetis", color: "green" };
        case "semen/ beton":
        case "semen":
            return { label: "Semen/ Beton", color: "orange" };
        case "parquette":
            return { label: "Parquette", color: "red" };
        case "taraflex":
            return { label: "Taraflex", color: "yellow" };
        case "karpet plastik":
            return { label: "Karpet Plastik", color: "teal" };
        default:
            return { label: typeName || "Tidak Diketahui", color: "gray" };
    }
};

export const getCourtCategory = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";

    switch (name) {
        case "airsoft_gun":
            return { label: "Airsoft Gun", color: "gray" };
        case "badminton":
            return { label: "Badminton", color: "blue" };
        case "basketball":
            return { label: "Basket", color: "orange" };
        case "baseball":
            return { label: "Bisbol", color: "red" };
        case "futsal":
            return { label: "Futsal", color: "teal" };
        case "golf":
            return { label: "Golf", color: "green" };
        case "hockey":
            return { label: "Hoki", color: "indigo" };
        case "mini_soccer":
            return { label: "Mini Soccer", color: "emerald" };
        case "paddle":
            return { label: "Padel", color: "cyan" };
        case "football":
            return { label: "Sepak Bola", color: "green" };
        case "softball":
            return { label: "Sofbol", color: "rose" };
        case "tennis":
            return { label: "Tennis", color: "lime" };
        case "volleyball":
            return { label: "Voli", color: "yellow" };
        case "yoga":
            return { label: "Yoga", color: "purple" };
        default:
            return { label: categoryName || "Olahraga", color: "gray" };
    }
};

export const getDayType = (type) => {
    const name = type?.toLowerCase() || "";

    switch (name) {
        case "weekday":
            return { label: "Hari Biasa", color: "yellow" };
        case "weekend":
            return { label: "Akhir Pekan", color: "emerald" };
        case "holiday":
            return { label: "Libur Nasional", color: "red" };
        default:
            return { label: type || "Reguler", color: "gray" };
    }
};
