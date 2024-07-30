import { Router } from "jsr:@oak/oak/router";
import routerCustomers from "../routers/routerCustomers.tsx";

const routerTenant = new Router();

routerTenant.use("/customers", routerCustomers.routes())

export default routerTenant;
