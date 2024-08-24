import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import routerDashboard from "../routers/routerDashboard.tsx";
import routerAuth from "../routers/routerAuth.ts";
import Index from "../pages/Index.tsx";
import checkTenant from "../middleware/checkTenant.ts";
import routerCustomers from "./routerCustomers.tsx";
import routerInventory from "./routerInventory.tsx";
import routerBookings from "./routerBookings.tsx";

const routerIndex = new Router();

routerIndex
  .get("/", (context) => {
    context.response.body = render(<Index />);
  })
  .use("/auth", routerAuth.routes())
  .use("/dashboard", routerDashboard.routes())
  .use("/", checkTenant)
  .use("/customers", routerCustomers.routes())
  .use("/bookings", routerBookings.routes())
  .use("/inventory", routerInventory.routes());

export default routerIndex;
