import { Router } from "jsr:@oak/oak/router";
import routerCustomer from "./routerCustomer.tsx";

import Customers from "../pages/customers/Customers.jsx";
import { CustomerPeopleTab } from "../pages/Customer/CustomerTabs.tsx";
import r from "../utils/r.jsx";

const kv = await Deno.openKv();

const routerCustomers = new Router();

routerCustomers
  .get("/", async (context) => {
    // const people = await getPeople(connection);

    const customers = await Array.fromAsync(kv.list({ prefix: ['bigshelf_test','customer'] }));

    context.response.body = r(<Customers customers={customers} />);
  })
  .get("/new", (context) => {
    context.response.body = 'form for creating a new customer';
  })
  .post("/new", async (context) => {

    const customerId = 1;

    context.response.redirect(`/customers/${customerId}`);
  });

routerCustomers.use("/:customerId", routerCustomer.routes());

export default routerCustomers;
