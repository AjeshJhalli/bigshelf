import { Middleware } from "https://deno.land/x/oak/mod.ts";
import { decode } from "https://deno.land/x/djwt/mod.ts";

const kv = await Deno.openKv();

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

// Middleware to authenticate users with Azure B2C
const azureB2CAuth: Middleware = async (ctx, next) => {

  if (ctx.request.url.pathname === "/" || ctx.request.url.pathname === "/auth/callback") {
    await next();
    return;
  }

  const token = await ctx.cookies.get("id_token");
  const refreshToken = await ctx.cookies.get("refresh_token");

  if (!token) {
    // Redirect to Azure B2C login page
    const authUrl =
      `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scope}`;
    console.log('redirect to microsoft');
    ctx.response.redirect(authUrl);
    return;
  }

  try {
    // Validate the token
    const payload = decode(token)[1];
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp < now) {
      // Token is expired, try to refresh
      if (!refreshToken) {
        console.log("no refresh token")
        throw new Error("Refresh token not found");
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
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            client_secret: clientSecret,
          } as Record<string, string>),
        },
      );

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        console.log("could not refresh")
        throw new Error(tokenData.error_description || "Token refresh failed");
      }

      await ctx.cookies.set("id_token", tokenData.id_token, { httpOnly: true });
      await ctx.cookies.set("refresh_token", tokenData.refresh_token, {
        httpOnly: true,
      });

      console.log(tokenData)

      ctx.state.user = await setUser(tokenData.id_token);
    } else {
      console.log('set the user')
      ctx.state.user = await setUser(token);
    }

    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    ctx.response.status = 401;
    ctx.response.body = { error: "Authentication required" };
  }
};

// Route to handle Azure B2C callback
const handleAzureB2CCallback: Middleware = async (ctx) => {

  console.log("I am ever reached")

  const code = ctx.request.url.searchParams.get("code");

  console.log("scoopy")

  if (!code) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Code not found" };
    console.log("no code")
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

  console.log('bruh monument')

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    ctx.response.status = 401;
    ctx.response.body = {
      error: tokenData.error_description || "Token exchange failed",
    };
    console.log("token exchange failed")
    return;
  }

  await ctx.cookies.set("refresh_token", tokenData.refresh_token, {
    httpOnly: true,
  });
  await ctx.cookies.set("id_token", tokenData.id_token, { httpOnly: true });

  console.log(tokenData);

  console.log("redirect to dashboard")
  ctx.response.redirect("/dashboard");
};

async function setUser(idToken: string) {
  const payload = decode(idToken)[1];

  console.log('id:' + idToken);
  console.log(payload);

  const oid = payload.oid;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  let user = await kv.get(["user", oid]);

  if (!user) {
    await kv.set(["user", oid], {
      firstName,
      lastName
    });
    user = await kv.get(["user", oid]);
  }

  return user;
}

export { azureB2CAuth, handleAzureB2CCallback };
