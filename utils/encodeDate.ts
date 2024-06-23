import { Month } from "../types/types.ts";
import { Day } from "../types/types.ts";
import { Year, MM } from "../types/types.ts";
import { DateString } from "../types/types.ts";

export default function encodeDate(year: Year, month: Month, day: Day): DateString {

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
    "Dec": "12"
  };

  return `${year}-${monthMap[month]}-${day.length === 2 ? day : `0${day}`}`;
}