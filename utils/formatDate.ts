import { DateString } from "../types/types.ts";

export default function formatDate(dateString: DateString | "") {
  return !dateString ? "" : new Date(dateString).toDateString().slice(4);
}
