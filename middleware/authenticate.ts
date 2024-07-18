import { Middleware } from "https://deno.land/x/oak/mod.ts";
import { decode } from "https://deno.land/x/djwt/mod.ts";
import authUrl from "../utils/authUrl.ts";

const kv = await Deno.openKv();

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

// Middleware to authenticate users with Azure B2C
const azureB2CAuth: Middleware = async (context, next) => {
  if (context.request.url.pathname === "/auth/callback") {
    await next();
    return;
  }

  const token = await context.cookies.get("id_token");
  const refreshToken = await context.cookies.get("refresh_token");

  if (!token) {
    if (context.request.url.pathname === "/") {
      await next();
      return;
    } else {
      context.response.redirect("/");
      return;
    }
  }

  try {
    // Validate the token
    const payload = decode(token)[1];
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp < now) {
      // Token is expired, try to refresh
      if (!refreshToken) {
        console.log("no refresh token");
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
        console.log("could not refresh");
        throw new Error(tokenData.error_description || "Token refresh failed");
      }

      await context.cookies.set("id_token", tokenData.id_token, {
        httpOnly: true,
      });
      await context.cookies.set("refresh_token", tokenData.refresh_token, {
        httpOnly: true,
      });

      context.state.user = await setUser(tokenData.id_token);
      console.log(context.state.user);
      context.state.user.initials = `${context.state.user.value.firstName[0]}${
        context.state.user.value.lastName[0]
      }`;
    } else {
      context.state.user = await setUser(token);
      console.log(context.state.user);
      context.state.user.initials = `${context.state.user.value.firstName[0]}${
        context.state.user.value.lastName[0]
      }`;
    }

    if (context.request.url.pathname === "/") {
      context.response.redirect("/dashboard");
      return;
    } else {
      await next();
    }
  } catch (error) {
    console.error("Authentication error:", error);
    context.response.status = 401;
    context.response.body = { error: "Authentication required" };
  }
};

// Route to handle Azure B2C callback
const handleAzureB2CCallback: Middleware = async (context) => {
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
};

async function setUser(idToken: string) {
  const payload = decode(idToken)[1];

  const oid = payload.oid;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  let user = await kv.get(["user", oid]);

  if (!user.versionstamp) {
    await kv.set(["user", oid], {
      firstName,
      lastName,
    });
    user = await kv.get(["user", oid]);
  }

  return user;
}

export { azureB2CAuth, handleAzureB2CCallback };
