import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import routerCustomers from "../routers/routerCustomers.tsx";
import routerDashboard from "../routers/routerDashboard.tsx";
import routerAuth from "../routers/routerAuth.ts";
import Index from "../pages/Index.tsx";
import r from "../utils/r.tsx";
import Tenants from "../pages/tenants/Tenants.tsx";
import { User } from "../data/model.ts";

const kv = await Deno.openKv();

const routerIndex = new Router();

routerIndex
  .get("/", (context) => {
    context.response.body = render(<Index />);
  })
  .get("/tenants", async (context) => {

    const userRecord = await kv.get(["user", context.state.user.oid]);
    const user = userRecord.value as User;

    const tenants = [];

    for (const tenantId of user.tenants) {
      const tenant = await kv.get(["tenant", tenantId]);
      tenants.push(tenant);
    }

    context.response.body = r(
      <Tenants user={user} tenants={tenants} />,
      [{ displayName: "Tenants", href: "/tenants" }],
      "Tenants",
      context.state.user.initials,
    );
  })
  .use("/auth", routerAuth.routes())
  .use("/customers", routerCustomers.routes())
  .use("/dashboard", routerDashboard.routes());

export default routerIndex;
