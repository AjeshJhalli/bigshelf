import { Handlers, PageProps } from "$fresh/server.ts";
import getUser from "../../../../data/getUser.ts";
import { User } from "../../../../data/model.ts";
import EditFormModal, {
  FormField,
} from "../../../../islands/EditFormModal.tsx";
import { DateString } from "../../../../types/types.ts";
import decodeDate from "../../../../utils/decodeDate.ts";

interface Data {
  fields: Array<FormField>
}

export default function Home(props: PageProps) {

  const { data } = props;

  console.log(data)



  return (
    <EditFormModal
      fields={data.fields}
      saveHref="/dashboard/me/edit"
      title=""
    />
  );
}

export const handler: Handlers<Data> = {
  async GET(_request, context) {
    console.log(context.state)
    const user = await getUser(context.state.user.oid);

    if (!user) {
      return new Response("User not found", { status: 500 });
    }

    return context.render({ fields: userForm(user) });
  },
  async POST(request, context) {
  },
};

function userForm(user: User): Array<FormField> {

  const dob = decodeDate(
    user.dob as DateString || "",
  );

  return [
    {
      type: "text",
      name: "firstName",
      displayName: "First Name",
      value: user.firstName,
    },
    {
      type: "text",
      name: "lastName",
      displayName: "Last Name",
      value: user.lastName,
    },
    {
      type: "text",
      name: "jobTitle",
      displayName: "Job Title",
      value: user.jobTitle,
    },
    {
      type: "dropdown",
      name: "gender",
      displayName: "Gender",
      value: user.gender,
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
      ...dob,
    },
  ];
}