import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.jsx";
import Customer from "../pages/Customer/Customer.tsx";
import { CustomerPeopleTab } from "../pages/Customer/CustomerTabs.tsx";
import { CustomerBookingsTab } from "../pages/Customer/CustomerTabs.tsx";
import Tabs from "../components/Tabs.tsx";
import CustomerEdit from "../pages/Customer/CustomerEdit.tsx";
import EditFormModal from "../components/EditFormModal.tsx";
import { FormField } from "../components/EditFormModal.tsx";
import decodeDate from "../utils/decodeDate.ts";
import encodeDate from "../utils/encodeDate.ts";

const kv = await Deno.openKv();

const routerCustomer = new Router();

routerCustomer
  .get("/", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    const customer = await kv.get(["bigshelf_test", "customer", customerId]);
    const people = await Array.fromAsync(
      kv.list({ prefix: ["bigshelf_test", "person", customerId] }),
    );
    context.response.body = r(<Customer customer={customer} people={people} />);
  })
  .get("/edit", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    const customer = await kv.get(["bigshelf_test", "customer", customerId]);
    context.response.body = r(<CustomerEdit customer={customer} />);
  }).get("/tab-people", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    console.log(customerId);
    const people = await Array.fromAsync(
      kv.list({ prefix: ["bigshelf_test", "person", customerId] }),
    );
    context.response.body = render(
      <Tabs
        selectedTabName="people"
        tabsId="customer-tabs"
        tabs={[
          {
            displayName: "People",
            name: "people",
            content: CustomerPeopleTab,
            data: { people },
            href: `/customers/${customerId}/tab-people`,
          },
          {
            displayName: "Bookings",
            name: "bookings",
            content: CustomerBookingsTab,
            data: {},
            href: `/customers/${customerId}/tab-bookings`,
          },
        ]}
      />,
    );
  }).get("/tab-bookings", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    context.response.body = render(
      <Tabs
        selectedTabName="bookings"
        tabsId="customer-tabs"
        tabs={[
          {
            displayName: "People",
            name: "people",
            content: CustomerPeopleTab,
            data: {},
            href: `/customers/${customerId}/tab-people`,
          },
          {
            displayName: "Bookings",
            name: "bookings",
            content: CustomerBookingsTab,
            data: {},
            href: `/customers/${customerId}/tab-bookings`,
          }
        ]}
      />,
    );
  }).get("/people/:personId/edit", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    const personId = parseInt(context.params.personId || "");

    const person = await kv.get([
      "bigshelf_test",
      "person",
      customerId,
      personId,
    ]);
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

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/customers/${customerId}/people/${personId}/edit`}
        title=""
      />,
    );
  })
  .post("/people/:personId/edit", async (context) => {
    const customerId = parseInt(context.params.customerId || "");
    const personId = parseInt(context.params.personId || "");

    const data = await context.request.body.formData();

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const jobTitle = data.get("jobTitle");
    const gender = data.get("gender");

    const dobDay = data.get("dobDay");
    const dobMonth = data.get("dobMonth");
    const dobYear = data.get("dobYear");

    if (!(typeof dobDay === "string" && typeof dobMonth === "string" && typeof dobYear === "string")) {
      return;
    }

    const dob = encodeDate(dobYear, dobMonth, dobDay);

    // Validate the data here

    const oldPerson = await kv.get(["bigshelf_test", "person", customerId, personId]);

    await kv.set(["bigshelf_test", "person", customerId, personId], {
      ...(oldPerson.value as object),
      firstName,
      lastName,
      jobTitle,
      gender,
      dob
    });

    context.response.redirect(`/customers/${customerId}`);
  });

export default routerCustomer;
