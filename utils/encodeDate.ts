import { DateString, DD, MM, Month, YYYY } from "../types/types.ts";

export default function encodeDate(
  year: string,
  month: string,
  day: string,
): DateString | "" {

  if (!year || !month || !day) {
    return "";
  }

  const monthMap = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
  };

  if (
    ![
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].includes(month)
  ) {
    return "";
  }

  return `${year as YYYY}-${monthMap[month as Month] as MM}-${(day.length === 2
    ? day
    : `0${day}`) as DD}`;
}
