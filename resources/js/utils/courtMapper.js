export const mapTimeSlotInitialData = (courtTimeSlots, dayType) => {
    const slotsForType =
        courtTimeSlots?.filter(
            (ts) => (ts.day_type || ts.pivot?.day_type) === dayType
        ) || [];

    return {
        ids: slotsForType.map((ts) => Number(ts.id)),
        prices: slotsForType.reduce((acc, ts) => {
            acc[ts.id] = ts.price || ts.pivot?.price;
            return acc;
        }, {}),
    };
};
