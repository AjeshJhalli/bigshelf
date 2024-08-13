import { Router } from "jsr:@oak/oak/router";
import routerCustomers from "../routers/routerCustomers.tsx";
import routerInventory from "./routerInventory.tsx";

const routerTenant = new Router();

routerTenant
  .use("/customers", routerCustomers.routes())
  .use("/inventory", routerInventory.routes());

export default routerTenant;
