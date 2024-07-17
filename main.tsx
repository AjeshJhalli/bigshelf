import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import Index from "./pages/Index.jsx";
import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';

import {
  azureB2CAuth,
  handleAzureB2CCallback,
} from "./middleware/authenticate.ts";

import routerCustomers from "./routers/routerCustomers.tsx";
import routerDashboard from "./routers/routerDashboard.tsx";

const router = new Router();
const app = new Application();

router
  .get("/", (context) => {
    context.response.body = render(<Index />);
  })
  .get("/auth/sign-out", async (context) => {

    await context.cookies.clear({});

    context.response.redirect(`https://${Deno.env.get("TENANT_NAME")}.b2clogin.com/${Deno.env.get("TENANT_NAME")}.onmicrosoft.com/${Deno.env.get("POLICY")}/oauth2/v2.0/logout?post_logout_redirect_uri=${Deno.env.get("POST_SIGNOUT_REDIRECT_URI")}`);
  })
  .get("/auth/callback", handleAzureB2CCallback);

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
