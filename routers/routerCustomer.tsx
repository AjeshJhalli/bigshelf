import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import Customer, {
  CustomerEmailLastRow,
  CustomerEmailRow,
  CustomerEmailRowForm,
  CustomerMain,
  CustomerNameForm,
  CustomerPhoneNumberLastRow,
  CustomerPhoneNumberRow,
} from "../pages/Customer/Customer.jsx";
import { getCustomer } from "../data/customer.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";
import { dbPool } from "../database.ts";

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
          phoneNumbers={[]}
        />
      </>,
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

    const countResult = await client2.queryObject(
      `SELECT COUNT (id) FROM email_address WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}`,
    );

    let emailDefault = "FALSE";

    if (countResult.rows[0].count === 0n) {
      console.log("make this one default");
      emailDefault = "TRUE";
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
          defaultFlag={emailDefault === "TRUE"}
        />
        <CustomerEmailLastRow customerId={customerId} />
      </>,
    );
  })
  .get("/email-last-row", (context) => {
    const customerId = context.params.customerId as string;
    context.response.body = render(
      <CustomerEmailLastRow customerId={customerId} />,
    );
  })
  .get("/main/edit", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const customerResult = await client.queryObject(`
      SELECT name
      FROM customer
      WHERE customer.tenant_id = '${tenantId}' AND customer.id = ${customerId}
    `);

    const name = customerResult.rows[0].name;

    using client2 = await dbPool.connect();
    const emailAddressResult = await client2.queryObject(`
      SELECT id, label, email_address, default_flag
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}
    `);

    const emailAddresses = emailAddressResult.rows;

    context.response.body = render(
      <CustomerNameForm
        name={name}
        emailAddresses={emailAddresses}
        saveHref={`/customers/${customerId}/main`}
        cancelHref={`/customers/${customerId}/main`}
      />,
    );
  })
  .get("/main", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    using client = await dbPool.connect();
    const customerResult = await client.queryObject(`
      SELECT name, email_address
      FROM customer
      LEFT JOIN email_address
      ON customer.id = email_address.customer_id AND email_address.default_flag = TRUE
      WHERE customer.tenant_id = '${tenantId}' AND customer.id = ${customerId}
    `);

    const name = customerResult.rows[0].name;
    const emailAddress = customerResult.rows[0].email_address;

    context.response.body = render(
      <CustomerMain
        customerId={customerId}
        name={name}
        defaultEmail={emailAddress}
      />,
    );
  })
  .post("/main", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.form();
    const name = data.get("customerName");
    const emailAddressId = data.get("emailAddress");

    using client = await dbPool.connect();
    await client.queryArray(`
      UPDATE customer
      SET name = '${name}'
      WHERE tenant_id = '${tenantId}' AND id = ${customerId}
    `);

    using client2 = await dbPool.connect();
    await client2.queryArray(`
      UPDATE email_address
      SET default_flag = FALSE
      WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}
    `);

    using client3 = await dbPool.connect();
    await client3.queryArray(`
      UPDATE email_address
      SET default_flag = TRUE
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const customer = await getCustomer(tenantId, customerId);
    if (!customer) return;

    using client4 = await dbPool.connect();
    const emailAddressesResult = await client4.queryObject(
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
  .post("/phone-number-new", async (context) => {
    const tenantId = context.state.tenantId as string;
    const customerId = context.params.customerId as string;

    const data = await context.request.body.form();
    const label = data.get("label");
    const phoneNumber = data.get("phoneNumber");

    using client2 = await dbPool.connect();

    const countResult = await client2.queryObject(
      `SELECT COUNT (id) FROM email_address WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}`,
    );

    let phoneNumberDefault = "FALSE";

    if (countResult.rows[0].count === 0n) {
      console.log("make this one default");
      phoneNumberDefault = "TRUE";
    }

    using client = await dbPool.connect();
    await client.queryObject(
      `INSERT INTO phone_number (tenant_id, customer_id, label, phone_number, default_flag, dialcode) VALUES ('${tenantId}', ${customerId}, '${label}', '${phoneNumber}', ${phoneNumberDefault}, '44')`,
    );
    const phoneNumberIdResult = await client.queryArray`SELECT LASTVAL()`;
    const phoneNumberId = phoneNumberIdResult.rows[0][0];

    context.response.body = render(
      <>
        <CustomerPhoneNumberRow
          label={label}
          emailAddress={phoneNumber}
          customerId={customerId}
          phoneNumberId={phoneNumberId}
          defaultFlag={phoneNumberDefault === "TRUE"}
        />
        <CustomerPhoneNumberLastRow customerId={customerId} />
      </>,
    );
  });

export default routerCustomer;
