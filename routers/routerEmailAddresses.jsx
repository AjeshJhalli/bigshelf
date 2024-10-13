import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { Router } from "jsr:@oak/oak/router";
import Customer, {
  CustomerEmailRow,
  CustomerEmailRowForm,
} from "../pages/Customer/Customer.jsx";
import { getCustomer } from "../data/customer.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";
import { dbPool } from "../database.ts";

const routerEmailAddresses = new Router();

routerEmailAddresses
  .get("/:emailAddressId/edit", async (context) => {
    const tenantId = context.state.tenantId;
    const emailAddressId = context.params.emailAddressId;

    using client = await dbPool.connect();
    const emailAddressResult = await client.queryObject(
      `SELECT id, label, email_address FROM email_address WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    const label = emailAddressResult.rows[0].label;
    const emailAddress = emailAddressResult.rows[0].email_address;

    context.response.body = render(
      <CustomerEmailRowForm
        cancelHref={`/customers/0/email-addresses/${emailAddressId}`}
        label={label}
        emailAddress={emailAddress}
        saveHref={`/customers/0/email-addresses/${emailAddressId}/edit`}
      />,
    );
  })
  .post("/:emailAddressId/edit", async (context) => {
    const tenantId = context.state.tenantId;
    const emailAddressId = parseInt(context.params.emailAddressId);

    const data = await context.request.body.form();

    const label = data.get("label");
    const emailAddress = data.get("emailAddress");

    using client = await dbPool.connect();
    await client.queryObject(`UPDATE email_address
      SET email_address = '${emailAddress}', label = '${label}'
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const emailAddressesResult = await client.queryObject(`
      SELECT default_flag, customer_id
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const defaultFlag = emailAddressesResult.rows[0].default_flag;
    const customerId = emailAddressesResult.rows[0].customer_id;

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
  .post("/:emailAddressId/make-default", async (context) => {
    const tenantId = context.state.tenantId;
    const emailAddressId = context.params.emailAddressId;

    using client3 = await dbPool.connect();

    const customerIdResponse = await client3.queryArray(`
      SELECT customer_id
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}
    `);

    const customerId = customerIdResponse.rows[0][0];

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

    const emailAddressesResult = await client.queryObject(`
      SELECT label, email_address, id, default_flag
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND customer_id = ${customerId}
      ORDER BY default_flag DESC, creation_timestamp ASC
    `);

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
  .get("/:emailAddressId", async (context) => {
    const tenantId = context.state.tenantId;
    const emailAddressId = context.params.emailAddressId;

    const customerIdResponse = await client3.queryArray(`
      SELECT customer_id
      FROM email_address
      WHERE tenant_id = '${tenantId}' AND id = ${id}
    `);

    const customerId = customerIdResponse.rows[0][0];

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
  .delete("/:emailAddressId", async (context) => {
    const tenantId = context.state.tenantId;
    const emailAddressId = context.params.emailAddressId;

    using client = await dbPool.connect();
    await client.queryObject(
      `DELETE FROM email_address WHERE tenant_id = '${tenantId}' AND id = ${emailAddressId}`,
    );

    context.response.body = "";
  })

export default routerEmailAddresses;
