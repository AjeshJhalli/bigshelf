import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import Customer from "../pages/Customer/Customer.tsx";
import EditFormModal from "../components/EditFormModal.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { Person } from "../types/types.ts";
import createPerson from "../data/createPerson.ts";
import { getCustomerPeople, getCustomer, updateCustomer, deleteCustomer } from "../data/customer.ts";
import formCustomer from "../forms/formCustomer.ts";
import formPerson from "../forms/formPerson.ts";
import getPerson from "../data/getPerson.ts";
import { DateString } from "../types/types.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";

const kv = await Deno.openKv();

const routerCustomer = new Router();

routerCustomer
  .get("/", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    const people = await getCustomerPeople(tenantId, customerId);

    context.response.body = render(
      <>
        <ModuleNav oob activeModule="customers" />
        <Breadcrumbs
          breadcrumbs={[{
            displayName: "Customers",
            href: "/customers",
          }, { displayName: customer.name, href: `/customers/${customer.id}` }]}
        />
        <Customer
          customer={customer}
          people={people}
        />
      </>,
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
        saveHref={`/customers/${customerId}/edit`}
        deleteHref={`/customers/${customerId}`}
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
        saveHref={`/customers/${customerId}/people/${personId}/edit`}
        deleteHref={`/customers/${customerId}/people/${personId}`}
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

    context.response.redirect(`/customers/${customerId}`);
  })
  .get("/people/new", (context) => {
    const customerId = context.params.customerId as string;

    const fields = formPerson({
      id: "",
      customerId,
      firstName: "",
      lastName: "",
      jobTitle: "",
      gender: "",
      dob: "" as DateString,
      emailAddress: "",
    });

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/customers/${customerId}/people/new`}
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

    let dob: DateString;

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
      customerId,
      firstName,
      lastName,
      jobTitle,
      gender,
      dob,
      emailAddress,
    }, tenantId);

    const updatedCustomer = await getCustomer(tenantId, customerId);
    const customerPeople = await getCustomerPeople(tenantId, customerId);

    if (!updatedCustomer) {
      context.response.status = 500;
      return;
    }

    context.response.body = render(
      <Customer
        oob
        customer={updatedCustomer}
        people={customerPeople}
      />,
    );
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
      address,
    });

    const updatedCustomer = await getCustomer(tenantId, customerId);
    const customerPeople = await getCustomerPeople(tenantId, customerId);

    if (!updatedCustomer) {
      context.response.status = 500;
      return;
    }

    context.response.body = render(
      <Customer
        oob
        customer={updatedCustomer}
        people={customerPeople}
      />,
    );
  })
  .delete("/", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    await deleteCustomer(tenantId, customerId);
    context.response.headers.append("HX-Redirect", "/customers");
  })
  .delete("/people/:personId", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;
    const personId = context.params.personId as string;
    await kv.delete([tenantId, "person", customerId, personId]);
    context.response.headers.append(
      "HX-Redirect",
      `/customers/${customerId}`,
    );
  });

export default routerCustomer;
