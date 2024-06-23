import EditForm, { FormField } from "../../components/EditForm.tsx";
import { User }from "../../types/types.ts";

export default function UserProfileEdit({ user }: { user: User }) {
  const fields: Array<FormField> = [
    {
      type: "text",
      name: "firstName",
      displayName: "First Name",
      value: user.value.firstName,
      options: [],
      day: "",
      month: "",
      year: ""
    },
    {
      type: "text",
      name: "lastName",
      displayName: "Last Name",
      value: user.value.lastName,
      options: [],
      day: "",
      month: "",
      year: ""
    },
    {
      type: "text",
      name: "jobTitle",
      displayName: "Job Title",
      value: user.value.jobTitle || "",
      options: [],
      day: "",
      month: "",
      year: ""
    },
    {
      type: "dropdown",
      name: "gender",
      displayName: "Gender",
      value: user.value.gender || "",
      options: [
        {
          value: "Male",
          displayName: "Male"
        },
        {
          value: "Female",
          displayName: "Female"
        },
      ],
      day: "",
      month: "",
      year: ""
    },
    {
      type: "date",
      name: "dob",
      displayName: "DOB",
      value: "",
      options: [],
      day: "12",
      month: "November",
      year: "2002"
    }
  ];

  return (
    <div class="grid grid-cols-2">
      <EditForm fields={fields} cancelHref="" saveHref="" title="Edit User" />
    </div>
  );
}
