import { Router } from "jsr:@oak/oak/router";
import routerCustomer from "./routerCustomer.tsx";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import Customers from "../pages/Customer/Customers.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import { createCustomer, getCustomers } from "../data/customer.ts";
import { dbPool } from "../database.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";
import formCustomer from "../forms/formCustomer.ts";

const routerCustomers = new Router();

routerCustomers
  .get("/", async (context) => {
    const tenantId = context.state.tenantId;

    const customers = await getCustomers(tenantId);

    context.response.body = render(
      <>
        <ModuleNav oob activeModule="customers" />
        <Breadcrumbs
          breadcrumbs={[{ displayName: "Customers", href: "/customers" }]}
        />
        <Customers customers={customers} />
      </>,
    );
  })
  .get("/new", (context) => {
    const fields: Array<FormField> = formCustomer({
      id: "",
      name: "",
      address: { line1: "", line2: "", city: "", country: "", postcode: "" },
    });

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref="/customers/new"
      />,
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

    context.response.headers.set("HX-Redirect", `/customers/${customerId}`);
  });

routerCustomers.use("/:customerId", routerCustomer.routes());

export default routerCustomers;
