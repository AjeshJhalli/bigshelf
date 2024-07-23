import { Router } from "jsr:@oak/oak/router";
import {
  handleAzureB2CCallback,
} from "../middleware/authenticate.ts";

const routerAuth = new Router();

routerAuth

  .get("/sign-out", async (context) => {

    await context.cookies.clear({});

    context.response.redirect(`https://${Deno.env.get("TENANT_NAME")}.b2clogin.com/${Deno.env.get("TENANT_NAME")}.onmicrosoft.com/${Deno.env.get("POLICY")}/oauth2/v2.0/logout?post_logout_redirect_uri=${Deno.env.get("POST_SIGNOUT_REDIRECT_URI")}`);
  })
  .get("/callback", handleAzureB2CCallback);
  
export default routerAuth;