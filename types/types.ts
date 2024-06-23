export type TypePerson = {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
  dob: string;
};

export type User = {
  key: ["user", string];
  value: {
    firstName: string;
    lastName: string;
    jobTitle: string | undefined;
    gender: string | undefined;
    dob: DateString | undefined;
  };
};

type oneToNine = "1" | "2" | "3" |"4" | "5" | "6" | "7" | "8" | "9";
type zeroToNine = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`;
export type MM = `0${oneToNine}` | `1${"0" | "1" | "2"}`;
export type DD = `${0}${oneToNine}` | `${"1" | "2"}${zeroToNine}` | `3${"0" | "1"}`;

export type Year =
  | `19${zeroToNine}${zeroToNine}`
  | `20${zeroToNine}${zeroToNine}`;
export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";
export type Day =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

export type DateString = `${YYYY}-${MM}-${DD}`;
