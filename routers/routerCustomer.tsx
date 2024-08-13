import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.tsx";
import Customer from "../pages/Customer/Customer.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { CustomerType, Person } from "../types/types.ts";
import createPerson from "../data/createPerson.ts";
import getCustomer from "../data/getCustomer.ts";
import getCustomerPeople from "../data/getCustomerPeople.ts";
import formCustomer from "../forms/formCustomer.ts";
import formPerson from "../forms/formPerson.ts";
import getPerson from "../data/getPerson.ts";
import updateCustomer from "../data/updateCustomer.ts";
import { DateString } from "../types/types.ts";

const kv = await Deno.openKv();

const routerCustomer = new Router();

routerCustomer
  .get("/", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    const people = await getCustomerPeople(tenantId, customerId);

    context.response.body = r(
      <Customer
        customer={customer}
        people={people}
        activeTenant={tenantId}
      />,
      [{
        displayName: "Customers",
        href: `/${tenantId}/customers`,
      }, {
        displayName: customer.name,
        href: `/${tenantId}/customers/${customerId}`,
      }],
      "customers",
      context.state.user.activeTenant,
    );
  })
  .get("/edit", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    const fields = formCustomer(customer);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerId}/edit`}
        deleteHref={`/${tenantId}/customers/${customerId}`}
        deleteConfirmation="Are you sure you want to delete this customer?"
      />,
    );
  })
  .get("/people/:personId/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    const personId = context.params.personId;

    const person = await getPerson(tenantId, customerId, personId);
    if (!person) return;

    const fields = formPerson(person);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerId}/people/${personId}/edit`}
        deleteHref={`/${tenantId}/customers/${customerId}/people/${personId}`}
        deleteConfirmation="Are you sure you want to delete this person?"
      />,
    );
  })
  .post("/people/:personId/edit", async (context) => {
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
    const dob = encodeDate(dobYear, dobMonth, dobDay);

    const oldPerson = await getPerson(tenantId, customerId, personId);

    await kv.set([tenantId, "person", customerId, personId], {
      ...(oldPerson as Person),
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
      emailAddress,
    });

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  })
  .get("/people/new", (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const fields = formPerson({
      id: "",
      customerId,
      firstName: "",
      lastName: "",
      jobTitle: "",
      gender: "",
      dob: "" as DateString,
      emailAddress: ""
    });

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/customers/${customerId}/people/new`}
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

    await updateCustomer(tenantId, customerId, {
      id: customerId,
      name,
      address
    });

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  })
  .delete("/", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const customer = await kv.get<CustomerType>([
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
    context.response.headers.append(
      "HX-Redirect",
      `/${tenantId}/customers/${customerId}`,
    );
  });

export default routerCustomer;
