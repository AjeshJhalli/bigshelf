import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import { DateString } from "../types/types.ts";
import decodeDate from "../utils/decodeDate.ts";

const kv = await Deno.openKv();

const routerDashboard = new Router();

routerDashboard
  .get("/", (context) => {
    context.response.body = r(
      <Dashboard user={context.state.user} />,
      [{
        displayName: "Dashboard",
        href: "/dashboard",
      }],
      "dashboard",
      context.state.user.initials,
    );
  })
  .get("/me/edit", async (context) => {


    const person = await kv.get(context.state.user.key);

    const { year, month, day } = decodeDate(
      context.state.user.value.dob as DateString || "",
    );

    const fields: Array<FormField> = [
      {
        type: "text",
        name: "firstName",
        displayName: "First Name",
        value: person.value.firstName
      },
      {
        type: "text",
        name: "lastName",
        displayName: "Last Name",
        value: person.value.lastName
      },
      {
        type: "text",
        name: "jobTitle",
        displayName: "Job Title",
        value: person.value.jobTitle
      },
      {
        type: "dropdown",
        name: "gender",
        displayName: "Gender",
        value: person.value.gender,
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

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref="/dashboard/me/edit"
        title=""
      />,
    );
  })
  .post("/me/edit", async (context) => {

    console.log("hello")

    const user = context.state.user;

    const data = await context.request.body.formData();

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const jobTitle = data.get("jobTitle");
    const gender = data.get("gender");

    const dobYear = data.get("dobYear")?.toString() || "";
    const dobMonth = data.get("dobMonth")?.toString() || "";
    const dobDay = data.get("dobDay")?.toString() || "";

    const dob = encodeDate(dobYear, dobMonth, dobDay);

    await kv.set(user.key, {
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
    });

    context.response.redirect("/dashboard");
  });

export default routerDashboard;
