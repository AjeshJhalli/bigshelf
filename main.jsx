import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import Index from "./pages/Index.jsx";
import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';

import {
  azureB2CAuth,
  handleAzureB2CCallback,
} from "./middleware/authenticate.ts";

import routerCustomers from "./routers/routerCustomers.tsx";
import routerPublic from "./routers/routerPublic.js";
import routerDashboard from "./routers/routerDashboard.tsx";

const router = new Router();
const app = new Application();

router
  .get("/", (context) => {
    console.log(context)
    context.response.body = render(<Index />);
  })
  .get("/auth/callback", handleAzureB2CCallback);

router.use("/public", routerPublic.routes());
router.use("/customers", routerCustomers.routes());
router.use("/dashboard", routerDashboard.routes());

app.use(async (context, next) => {
  context.response.headers.set("Content-Type", "text/html");
  await next();
});

app.use(azureB2CAuth);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
