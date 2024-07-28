import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import routerCustomers from "../routers/routerCustomers.tsx";
import routerDashboard from "../routers/routerDashboard.tsx";
import routerAuth from "../routers/routerAuth.ts";
import Index from "../pages/Index.tsx";

const routerIndex = new Router();

routerIndex
  .get("/", (context) => {
    context.response.body = render(<Index />);
  })
  .use("/auth", routerAuth.routes())
  .use("/customers", routerCustomers.routes())
  .use("/dashboard", routerDashboard.routes());

export default routerIndex;
