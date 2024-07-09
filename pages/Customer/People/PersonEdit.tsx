import EditForm, { FormField } from "../../../components/EditForm.tsx";
import decodeDate from "../../../utils/decodeDate.ts";

export default function PersonEdit({ person }) {
  const { year, month, day } = decodeDate(person.value.dob || "");

  const fields: Array<FormField> = [
    {
      type: "text",
      name: "firstName",
      displayName: "First Name",
      value: person.value.firstName,
    },
    {
      type: "text",
      name: "lastName",
      displayName: "Last Name",
      value: person.value.lastName,
    },
    {
      type: "text",
      name: "jobTitle",
      displayName: "Job Title",
      value: person.value.jobTitle || "",
    },
    {
      type: "dropdown",
      name: "gender",
      displayName: "Gender",
      value: person.value.gender || "",
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
  ];

  return (
    <EditForm
      fields={fields}
      cancelHref={`/customers/${person.key[2]}`}
      saveHref={`/customers/people/${person.key[2]}/edit`}
      title="Edit Person"
    />
  );
}
