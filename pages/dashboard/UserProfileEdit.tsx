import EditForm, { FormField } from "../../components/EditForm.tsx";
import { User } from "../../types/types.ts";
import decodeDate from "../../utils/decodeDate.ts";

export default function UserProfileEdit({ user }: { user: User }) {
  const { year, month, day } = decodeDate(user.value.dob || "");

  const fields: Array<FormField> = [
    {
      type: "text",
      name: "firstName",
      displayName: "First Name",
      value: user.value.firstName,
    },
    {
      type: "text",
      name: "lastName",
      displayName: "Last Name",
      value: user.value.lastName,
    },
    {
      type: "text",
      name: "jobTitle",
      displayName: "Job Title",
      value: user.value.jobTitle || "",
    },
    {
      type: "dropdown",
      name: "gender",
      displayName: "Gender",
      value: user.value.gender || "",
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
    <div class="grid grid-cols-2">
      <EditForm
        fields={fields}
        cancelHref="/dashboard"
        saveHref="/dashboard/me/edit"
        title="Edit User"
      />
    </div>
  );
}
