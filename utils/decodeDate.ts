import { DateString } from "../types/types.ts";

export default function decodeDate(dateString: DateString | "") {

  if (!dateString) {
    return { year: "", month: "", day: "" };
  }

  const months = [
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
  ];

  const parts = dateString.split("-");

  const year = parts[0];
  const month = months[parseInt(parts[1]) - 1];
  const day = parts[2];

  return {
    year,
    month,
    day,
  };
}
