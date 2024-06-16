import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { decode } from "https://deno.land/x/djwt/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import Index from "./pages/Index.jsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import r from "./utils/r.jsx";

import {
  azureB2CAuth,
  handleAzureB2CCallback,
} from "./middleware/authenticate.ts";

import routerPeople from "./routers/routerPeople.jsx";
import routerCustomers from "./routers/routerCustomers.tsx";
import routerPublic from "./routers/routerPublic.js";
import routerAuth from "./routers/routerAuth.jsx";

const env = await load();

const router = new Router();
const app = new Application();

router
  .get("/", (context) => {
    context.response.body = r(<Index />);
  })
  .get("/auth/callback", handleAzureB2CCallback)
  .get("/dashboard", async (context) => {
    context.response.body = r(<Dashboard user={context.state.user} />);
  });

router.use("/public", routerPublic.routes());
router.use("/auth", routerAuth.routes());
router.use("/people", routerPeople.routes());
router.use("/customers", routerCustomers.routes());

app.use(async (context, next) => {
  context.response.headers.set("Content-Type", "text/html");
  await next();
});

app.use(azureB2CAuth);
app.use(router.routes());

app.use(router.allowedMethods());



await app.listen({ port: 8000 });
