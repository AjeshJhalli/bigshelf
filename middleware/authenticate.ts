import { Middleware } from "https://deno.land/x/oak/mod.ts";
import { decode } from "https://deno.land/x/djwt/mod.ts";

const kv = await Deno.openKv();

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

console.log(`the tenant is ${tenant}`);
console.log(`the client id is ${clientId}`);
console.log(`the client secret is ${clientSecret}`);
console.log(`the policy is ${policy}`);
console.log(`the redirect ${redirectUri}`);

// Middleware to authenticate users with Azure B2C
const azureB2CAuth: Middleware = async (ctx, next) => {
  const token = await ctx.cookies.get("id_token");
  const refreshToken = await ctx.cookies.get("refresh_token");

  if (!token) {
    // Redirect to Azure B2C login page
    const authUrl =
      `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}`;
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
        throw new Error("Refresh token not found");
      }

      console.log(policy);

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
          }),
        },
      );

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || "Token refresh failed");
      }

      await ctx.cookies.set("id_token", tokenData.id_token, { httpOnly: true });
      await ctx.cookies.set("refresh_token", tokenData.refresh_token, {
        httpOnly: true,
      });

      ctx.state.user = await setUser(tokenData.id_token);

    } else {
      console.log('hola')
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
  const code = ctx.request.url.searchParams.get("code");

  if (!code) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Code not found" };
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
      }.toString()),
    },
  );

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    ctx.response.status = 401;
    ctx.response.body = {
      error: tokenData.error_description || "Token exchange failed",
    };
    return;
  }

  await ctx.cookies.set("refresh_token", tokenData.refresh_token, {
    httpOnly: true,
  });
  await ctx.cookies.set("id_token", tokenData.id_token, { httpOnly: true });

  ctx.response.redirect("/dashboard");
};

async function setUser(idToken: string) {
  const payload = decode(idToken)[1];

  const oid = payload.oid;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  let user = await kv.get(["user", oid]);

  if (!user) {
    await kv.set(["user", oid], {
      firstName,
      lastName,
    });
    user = await kv.get(["user", oid]);
  }

  return user;
}

export { azureB2CAuth, handleAzureB2CCallback };
