import { Router } from "jsr:@oak/oak/router";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import { DateString } from "../types/types.ts";
import decodeDate from "../utils/decodeDate.ts";
import getUser from "../data/getUser.ts";
import { User } from "../types/types.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";

const kv = await Deno.openKv();

const routerDashboard = new Router();

routerDashboard
  .get("/", async (context) => {
    const userRecord = await kv.get(["user", context.state.user.oid]);
    const user = userRecord.value as User;

    const tenants = [];

    for (const tenantId of user.tenants) {
      const tenant = await kv.get(["tenant", tenantId]);
      tenants.push(tenant);
    }

    context.response.body = render(
      <>
        <ModuleNav oob activeModule="dashboard" />
        <Breadcrumbs
          breadcrumbs={[{ displayName: "Dashboard", href: "/dashboard" }]}
        />
        <Dashboard user={context.state.user} tenants={tenants} />
      </>,
    );
  })
  .get("/me/edit", async (context) => {
    const user = await getUser(context.state.user.oid);

    if (!user) {
      context.response.body = "An unexpected error has occurred.";
      context.response.status = 500;
      return;
    }

    const dob = decodeDate(
      user.dob as DateString || "",
    );

    const fields: Array<FormField> = [
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

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref="/dashboard/me/edit"
      />,
    );
  })
  .post("/me/edit", async (context) => {
    const userId = context.state.user.oid;
    const user = await getUser(userId);

    if (!user) {
      context.response.status = 400;
      return;
    }

    const data = await context.request.body.formData();

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const jobTitle = data.get("jobTitle");
    const gender = data.get("gender");

    const dobYear = data.get("dobYear")?.toString() || "";
    const dobMonth = data.get("dobMonth")?.toString() || "";
    const dobDay = data.get("dobDay")?.toString() || "";

    const dob = encodeDate(dobYear, dobMonth, dobDay);

    await kv.set(["user", user.oid], {
      oid: user.oid,
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
      activeTenant: user?.activeTenant,
      tenants: user?.tenants?.length > 0 ? user.tenants : [],
    });

    context.response.redirect("/dashboard");
  });

export default routerDashboard;
