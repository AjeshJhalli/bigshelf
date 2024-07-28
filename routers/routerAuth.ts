import { Router } from "jsr:@oak/oak/router";

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

const routerAuth = new Router();

routerAuth
  .get("/sign-out", async (context) => {

    await context.cookies.clear({});

    context.response.redirect(`https://${Deno.env.get("TENANT_NAME")}.b2clogin.com/${Deno.env.get("TENANT_NAME")}.onmicrosoft.com/${Deno.env.get("POLICY")}/oauth2/v2.0/logout?post_logout_redirect_uri=${Deno.env.get("POST_SIGNOUT_REDIRECT_URI")}`);
  })
  .get("/callback", async (context) => {
    const code = context.request.url.searchParams.get("code");
  
    if (!code) {
      context.response.status = 400;
      context.response.body = { error: "Code not found" };
      console.log("no code");
      return;
    }
  
    const tokenResponse = await fetch(
      `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          scope: scope,
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          client_secret: clientSecret,
        } as Record<string, string>),
      },
    );
  
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      context.response.status = 401;
      context.response.body = {
        error: tokenData.error_description || "Token exchange failed",
      };
      return;
    }
  
    await context.cookies.set("refresh_token", tokenData.refresh_token, {
      httpOnly: true,
    });
    await context.cookies.set("id_token", tokenData.id_token, { httpOnly: true });
  
    context.response.redirect("/dashboard");
  });
  
export default routerAuth;