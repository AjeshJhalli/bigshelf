import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import routerDashboard from "../routers/routerDashboard.tsx";
import routerAuth from "../routers/routerAuth.ts";
import Index from "../pages/Index.tsx";
import checkTenant from "../middleware/checkTenant.ts";
import routerCustomers from "./routerCustomers.tsx";
import routerBookings from "./routerBookings.tsx";
import routerEmailAddresses from "./routerEmailAddresses.jsx";
import r from "../utils/r.tsx";

const routerIndex = new Router();

routerIndex
  .get("/", (context) => {
    context.response.body = render(<Index />);
  })
  .use("/auth", routerAuth.routes())
  .use("/", async (context, next) => {

    if (context.request.headers.get("HX-Request") === "true") {
      await next();
      return;
    }

    const url = new URL(context.request.url);
    const path = url.pathname;
    const activeModule = path.split("/")[1];

    context.response.body = r(<div hx-get={path} hx-trigger="load" />, [], activeModule);

  })
  .use("/dashboard", routerDashboard.routes())
  .use("/", checkTenant)
  .use("/customers", routerCustomers.routes())
  .use("/bookings", routerBookings.routes())
  .use("/email-addresses", routerEmailAddresses.routes());

export default routerIndex;
