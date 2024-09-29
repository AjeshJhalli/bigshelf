import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import Customer, {
  CustomerEmailLastRow,
  CustomerEmailRow,
  CustomerEmailRowForm,
  CustomerName,
  CustomerNameForm,
} from "../pages/Customer/Customer.jsx";
import EditFormModal from "../components/EditFormModal.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { Person } from "../types/types.ts";
import createPerson from "../data/createPerson.ts";
import {
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "../data/customer.ts";
import formCustomer from "../forms/formCustomer.ts";
import formPerson from "../forms/formPerson.ts";
import getPerson from "../data/getPerson.ts";
import { DateString } from "../types/types.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";
import { dbPool } from "../database.ts";

const kv = await Deno.openKv();

const routerCustomer = new Router();

routerCustomer
  .get("/", async (context) => {
    const customerId = context.params.customerId as string;
    const tenantId = context.state.tenantId as string;

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    using client = await dbPool.connect();
    const emailAddressesResult = await client.queryObject(
      `SELECT label, email_address, id, customer_id, default_flag FROM email_address WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId} ORDER BY default_flag DESC, creation_timestamp ASC`,
    );

    const emailAddresses = emailAddressesResult.rows;

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
          emailAddresses={emailAddresses}
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

    if (!updatedCustomer) {
      context.response.status = 500;
      return;
    }

    context.response.body = render(
      <Customer
        oob
        customer={updatedCustomer}
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

    if (!updatedCustomer) {
      context.response.status = 500;
      return;
    }

    context.response.body = render(
      <Customer
        oob
        customer={updatedCustomer}
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
  })
  .get("/email-new-row-form", (context) => {
    const customerId = context.params.customerId as string;
    context.response.body = render(
      <CustomerEmailRowForm
        cancelHref="/customers/0/email-last-row"
        saveHref={`/customers/${customerId}/email-new`}
        label=""
        emailAddress=""
      />,
    );
  })
  .post("/email-new", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.form();

    const label = data.get("label");
    const emailAddress = data.get("emailAddress");

    using client2 = await dbPool.connect();

    const countResult = await client2.queryObject(`SELECT COUNT (id) FROM email_address WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}`);

    let emailDefault = 'FALSE';

    if (countResult.rows[0].count === 0n) {
      console.log("make this one default");
      emailDefault = 'TRUE';
    }

    console.log(countResult);

    using client = await dbPool.connect();
    await client.queryObject(
      `INSERT INTO email_address (tenant_id, customer_id, label, email_address, default_flag) VALUES ('${tenantId}', ${customerId}, '${label}', '${emailAddress}', ${emailDefault})`,
    );
    const emailAddressIdResult = await client.queryArray`SELECT LASTVAL()`;

    const emailAddressId = emailAddressIdResult.rows[0][0];

    context.response.body = render(
      <>
        <CustomerEmailRow
          label={label}
          emailAddress={emailAddress}
          customerId={customerId}
          emailAddressId={emailAddressId}
          defaultFlag={emailDefault === 'TRUE'}
        />
        <CustomerEmailLastRow customerId={customerId} />
      </>,
    );
  })
  .get("/email-last-row", (context) => {
    const customerId = context.params.customerId as string;
    context.response.body = render(<CustomerEmailLastRow customerId={customerId} />);
  })
  .get("/email-addresses/:emailAddressId/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const emailAddressId = context.params.emailAddressId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const emailAddressResult = await client.queryObject(
      `SELECT id, label, email_address FROM email_address WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    const label = emailAddressResult.rows[0].label;
    const emailAddress = emailAddressResult.rows[0].email_address;

    context.response.body = render(
      <CustomerEmailRowForm
        cancelHref={`/customers/${customerId}/email-addresses/${emailAddressId}`}
        label={label}
        emailAddress={emailAddress}
        saveHref={`/customers/${customerId}/email-addresses/${emailAddressId}/edit`}
      />,
    );
  })
  .post("/email-addresses/:emailAddressId/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const emailAddressId = parseInt(context.params.emailAddressId);
    const customerId = context.params.customerId as string;

    console.log(context.params.emailAddressId);
    console.log(emailAddressId);

    const data = await context.request.body.form();

    const label = data.get("label");
    const emailAddress = data.get("emailAddress");

    using client = await dbPool.connect();
    await client.queryObject(`UPDATE email_address
      SET email_address = '${emailAddress}', label = '${label}'
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const emailAddressesResult = await client.queryObject(`
      SELECT default_flag
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const defaultFlag = emailAddressesResult.rows[0].default_flag;

    context.response.body = render(
      <CustomerEmailRow
        customerId={customerId}
        emailAddressId={emailAddressId}
        label={label}
        emailAddress={emailAddress}
        defaultFlag={defaultFlag}
      />,
    );
  })
  .post("/email-addresses/:emailAddressId/make-default", async (context) => {
    const tenantId = context.state.tenantId as string;
    const emailAddressId = context.params.emailAddressId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    using client2 = await dbPool.connect();
    await client.queryObject(
      `UPDATE email_address
      SET default_flag = FALSE
      WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}`,
    );
    await client2.queryObject(
      `UPDATE email_address
      SET default_flag = TRUE
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    const emailAddressesResult = await client.queryObject(
      `SELECT label, email_address, id, customer_id, default_flag FROM email_address WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId} ORDER BY default_flag DESC, creation_timestamp ASC`,
    );

    const emailAddresses = emailAddressesResult.rows;

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
          emailAddresses={emailAddresses}
        />
      </>,
    );

  })
  .get("/email-addresses/:emailAddressId", async (context) => {
    const tenantId = context.state.tenantId as string;
    const emailAddressId = context.params.emailAddressId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const emailAddressResult = await client.queryObject(
      `SELECT label, email_address, default_flag FROM email_address WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    const label = emailAddressResult.rows[0].label;
    const emailAddress = emailAddressResult.rows[0].email_address;
    const defaultFlag = emailAddressResult.rows[0].default_flag;

    context.response.body = render(
      <CustomerEmailRow
        customerId={customerId}
        emailAddress={emailAddress}
        label={label}
        emailAddressId={emailAddressId}
        defaultFlag={defaultFlag}
      />,
    );
  })
  .delete("/email-addresses/:emailAddressId", async (context) => {
    const tenantId = context.state.tenantId as string;
    const emailAddressId = context.params.emailAddressId as string;

    using client = await dbPool.connect();
    await client.queryObject(
      `DELETE FROM email_address WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    context.response.body = "";
  })
  .get("/name/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const nameResult = await client.queryArray(
      `SELECT name FROM customer WHERE tenant_id = '${tenantId}' AND id = ${customerId}`
    );

    const name = nameResult.rows[0][0];

    context.response.body = render(<CustomerNameForm saveHref={`/customers/${customerId}/name`} cancelHref={`/customers/${customerId}/name`}>{name}</CustomerNameForm>);

  })
  .get("/name", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const nameResult = await client.queryArray(
      `SELECT name FROM customer WHERE tenant_id = '${tenantId}' AND id = ${customerId}`
    );

    const name = nameResult.rows[0][0];

    context.response.body = render(<CustomerName customerId={customerId}>{name}</CustomerName>);

  })
  .post("/name", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.form();
    const name = data.get("customerName");

    using client = await dbPool.connect();
    await client.queryArray(
      `UPDATE customer SET name = '${name}' WHERE tenant_id = '${tenantId}' AND id = ${customerId}`
    );

    context.response.body = render(<CustomerName customerId={customerId}>{name}</CustomerName>);
  });

export default routerCustomer;
