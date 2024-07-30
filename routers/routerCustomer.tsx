import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.tsx";
import Customer from "../pages/Customer/Customer.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import decodeDate from "../utils/decodeDate.ts";
import encodeDate from "../utils/encodeDate.ts";
import {
  CustomerRecord,
  CustomerValue,
  DateString,
  PersonValue,
} from "../types/types.ts";
import createPerson from "../data/createPerson.ts";

const kv = await Deno.openKv();

const routerCustomer = new Router();

routerCustomer
  .get("/", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await kv.get<CustomerValue>([
      tenantId,
      "customer",
      customerId,
    ]);

    if (!customer.versionstamp) {
      return;
    }

    const customerRecord = customer as CustomerRecord;

    const people = await Array.fromAsync(
      kv.list({ prefix: [tenantId, "person", customerId] }),
    );

    context.response.body = r(
      <Customer
        customer={customerRecord}
        people={people}
        activeTenant={tenantId}
      />,
      [{
        displayName: "Customers",
        href: `/${tenantId}/customers`,
      }, {
        displayName: customerRecord.value.name,
        href: `/${tenantId}/customers/${customerId}`,
      }],
      "customers",
      context.state.user.activeTenant,
    );
  })
  .get("/edit", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await kv.get<CustomerValue>([
      tenantId,
      "customer",
      customerId,
    ]);

    if (!customer.versionstamp) {
      return;
    }

    const customerRecord = customer as CustomerRecord;

    const fields: Array<FormField> = [
      {
        type: "text",
        name: "name",
        displayName: "Customer Name",
        value: customerRecord.value.name,
      },
      {
        type: "text",
        name: "addressLine1",
        displayName: "Address Line 1",
        value: customerRecord.value.address.line1,
      },
      {
        type: "text",
        name: "addressLine2",
        displayName: "Address Line 2",
        value: customerRecord.value.address.line2,
      },
      {
        type: "text",
        name: "addressCity",
        displayName: "City",
        value: customerRecord.value.address.city,
      },
      {
        type: "text",
        name: "addressCountry",
        displayName: "Country",
        value: customerRecord.value.address.country,
      },
      {
        type: "text",
        name: "addressPostcode",
        displayName: "Postcode",
        value: customerRecord.value.address.postcode,
      },
    ];

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerRecord.key[2]}/edit`}
        deleteHref={`/${tenantId}/customers/${customerRecord.key[2]}`}
        deleteConfirmation="Are you sure you want to delete this customer?"
        title=""
      />,
    );
  })
  .get("/people/:personId/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    const personId = context.params.personId;

    const person = await kv.get<PersonValue>([
      tenantId,
      "person",
      customerId,
      personId,
    ]);

    if (!person.versionstamp) {
      return;
    }

    const { year, month, day } = decodeDate(
      person.value.dob as DateString || "",
    );

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
      {
        type: "text",
        name: "emailAddress",
        displayName: "Email",
        value: person.value.emailAddress || "",
      },
    ];

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerId}/people/${personId}/edit`}
        deleteHref={`/${tenantId}/customers/${customerId}/people/${personId}`}
        deleteConfirmation="Are you sure you want to delete this person?"
        title=""
      />,
    );
  })
  .post("/people/:personId/edit", async (context) => {

    console.log(context);

    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    const personId = context.params.personId;

    const data = await context.request.body.formData();

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const jobTitle = data.get("jobTitle");
    const gender = data.get("gender");
    const emailAddress = data.get("emailAddress");

    const dobDay = data.get("dobDay") as string;
    const dobMonth = data.get("dobMonth") as string;
    const dobYear = data.get("dobYear") as string;
    
    console.log("andrew tate")

    const dob = encodeDate(dobYear, dobMonth, dobDay);

    // Validate the data here

    const oldPerson = await kv.get([
      tenantId,
      "person",
      customerId,
      personId,
    ]);

    await kv.set([tenantId, "person", customerId, personId], {
      ...(oldPerson.value as PersonValue),
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
      emailAddress,
    });

    console.log("sigma")

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  })
  .get("/people/new", (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId;

    const fields: Array<FormField> = [
      {
        type: "text",
        name: "firstName",
        displayName: "First Name",
        value: "",
      },
      {
        type: "text",
        name: "lastName",
        displayName: "Last Name",
        value: "",
      },
      {
        type: "text",
        name: "jobTitle",
        displayName: "Job Title",
        value: "",
      },
      {
        type: "dropdown",
        name: "gender",
        displayName: "Gender",
        value: "",
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
        day: "",
        month: "",
        year: "",
      },
      {
        type: "text",
        name: "emailAddress",
        displayName: "Email",
        value: "",
      },
    ];

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerId}/people/new`}
        title=""
      />,
    );
  })
  .post("/people/new", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.formData();

    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const jobTitle = data.get("jobTitle") as string;
    const gender = data.get("gender") as string;
    const emailAddress = data.get("emailAddress") as string;

    const dobDay = data.get("dobDay") as string;
    const dobMonth = data.get("dobMonth") as string;
    const dobYear = data.get("dobYear") as string;

    let dob;

    if (
      !(typeof dobDay === "string" && typeof dobMonth === "string" &&
        typeof dobYear === "string")
    ) {
      dob = "";
    } else {
      dob = encodeDate(dobYear, dobMonth, dobDay);
    }

    // Validate the data here

    await createPerson(customerId, {
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
      emailAddress,
    }, tenantId);

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  })
  .post("/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.formData();

    const name = data.get("name") as string;
    const address = {
      line1: data.get("addressLine1") as string,
      line2: data.get("addressLine2") as string,
      city: data.get("addressCity") as string,
      country: data.get("addressCountry") as string,
      postcode: data.get("addressPostcode") as string,
    };

    // Validate the data here

    await kv.set([tenantId, "customer", customerId], {
      name,
      address,
    });

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  })
  .delete("/", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const customer = await kv.get<CustomerRecord>([
      tenantId,
      "customer",
      customerId,
    ]);
    if (customer.value === null) {
      return;
    }

    const deleteCustomerTransaction = kv.atomic()
      .check(customer)
      .delete([tenantId, "customer", customerId]);

    for await (
      const person of kv.list({
        prefix: [tenantId, "person", customerId],
      })
    ) {
      console.log(person);
      deleteCustomerTransaction.delete(person.key);
    }

    await deleteCustomerTransaction.commit();

    context.response.headers.append("HX-Redirect", `/${tenantId}/customers`);
  })
  .delete("/people/:personId", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    const personId = context.params.personId as string;
    await kv.delete([tenantId, "person", customerId, personId]);
    context.response.headers.append("HX-Redirect", `/${tenantId}/customers/${customerId}`);
  });

export default routerCustomer;
