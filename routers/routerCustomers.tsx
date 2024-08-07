import { Router } from "jsr:@oak/oak/router";
import routerCustomer from "./routerCustomer.tsx";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import Customers from "../pages/Customer/Customers.tsx";
import r from "../utils/r.tsx";
import { CustomerValue } from "../types/types.ts";
import { CustomerRecord } from "../types/types.ts";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import createCustomer from "../data/createCustomer.ts";

const kv = await Deno.openKv();

const routerCustomers = new Router();

routerCustomers
  .get("/", async (context) => {
    const tenantId = context.state.tenantId;

    const customers = await Array.fromAsync(
      kv.list<CustomerValue>({ prefix: [tenantId, "customer"] }),
    );

    const customerRecords = customers as Array<CustomerRecord>;

    context.response.body = r(
      <Customers customers={customerRecords} activeTenant={tenantId} />,
      [{
        displayName: "Customers",
        href: "/customers",
      }],
      "customers",
      tenantId
    );
  })
  .get("/new", (context) => {
    const tenantId = context.state.tenantId;

    const fields: Array<FormField> = [
      {
        type: "text",
        name: "name",
        displayName: "Customer Name",
        value: "",
      },
      {
        type: "text",
        name: "addressLine1",
        displayName: "Address Line 1",
        value: "",
      },
      {
        type: "text",
        name: "addressLine2",
        displayName: "Address Line 2",
        value: "",
      },
      {
        type: "text",
        name: "addressCity",
        displayName: "City",
        value: "",
      },
      {
        type: "text",
        name: "addressCountry",
        displayName: "Country",
        value: "",
      },
      {
        type: "text",
        name: "addressPostcode",
        displayName: "Postcode",
        value: "",
      },
    ];

    context.response.body = render(
      <EditFormModal fields={fields} saveHref={`/${tenantId}/customers/new`} title="" />,
    );
  })
  .post("/new", async (context) => {
    const tenantId = context.state.tenantId;

    const data = await context.request.body.formData();

    const name = data.get("name") as string;
    const address = {
      line1: data.get("addressLine1") as string,
      line2: data.get("addressLine2") as string,
      city: data.get("addressCity") as string,
      country: data.get("addressCountry") as string,
      postcode: data.get("addressPostcode") as string,
    };

    const customerId = await createCustomer({ name, address }, tenantId);

    context.response.redirect(`/${tenantId}/customers/${customerId}`);
  });

routerCustomers.use("/:customerId", routerCustomer.routes());

export default routerCustomers;
