import { FormField } from "../components/EditFormModal.tsx";
import { DateString, Person } from "../types/types.ts";
import decodeDate from "../utils/decodeDate.ts";

export default function formPerson(person: Person): Array<FormField> {

  const { year, month, day } = decodeDate(person.dob as DateString || "");

  return [
    {
      type: "text",
      name: "firstName",
      displayName: "First Name",
      value: person.firstName,
    },
    {
      type: "text",
      name: "lastName",
      displayName: "Last Name",
      value: person.lastName,
    },
    {
      type: "text",
      name: "jobTitle",
      displayName: "Job Title",
      value: person.jobTitle || "",
    },
    {
      type: "dropdown",
      name: "gender",
      displayName: "Gender",
      value: person.gender || "",
      options: [
        {
          value: "Male",
          displayName: "Male",
        },
        {
          value: "Female",
          displayName: "Female",
        },
      ],
    },
    {
      type: "date",
      name: "dob",
      displayName: "DOB",
      day,
      month,
      year,
    },
    {
      type: "text",
      name: "emailAddress",
      displayName: "Email",
      value: person.emailAddress || "",
    },
  ];

}