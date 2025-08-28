// utils/calendarFormats.js
import { DateTime } from "luxon";

const calendarFormats = {
    dayFormat: (date, culture, localizer) =>
        localizer.format(date, "ccc dd/MM", culture),

    dayHeaderFormat: (date, culture, localizer) =>
        localizer.format(date, "cccc, dd MMMM", culture),

    dayRangeHeaderFormat: ({ start, end }) =>
        `${DateTime.fromJSDate(start)
            .setLocale("id")
            .toFormat("dd MMM")} - ${DateTime.fromJSDate(end)
            .setLocale("id")
            .toFormat("dd MMM")}`,

    timeGutterFormat: (date, culture, localizer) => {
        const start = DateTime.fromJSDate(date).setLocale("id");
        const end = start.plus({ hours: 1 });
        return `${start.toFormat("HH:mm")} - ${end.toFormat("HH:mm")}`;
    },
};

export const formatDayShort = (luxonDate) =>
    luxonDate.setLocale("id").toFormat("ccc dd/MM");

export default calendarFormats;
