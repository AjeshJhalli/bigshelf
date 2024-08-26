import { decode } from "https://deno.land/x/djwt/mod.ts";
import createUser from "../data/createUser.ts";
import getUser from "../data/getUser.ts";

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const scope = "openid offline_access";

// Middleware to authenticate users with Azure B2C
const middlewareAuth = async (context, next) => {
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
      context.state.user.initials = `${context.state.user.firstName[0]}${
        context.state.user.lastName[0]
      }`;
    } else {
      context.state.user = await setUser(token);
      context.state.user.initials = `${context.state.user.firstName[0]}${
        context.state.user.lastName[0]
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

async function setUser(idToken: string) {
  const payload = decode(idToken)[1];

  const oid = payload.oid;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  let user = await getUser(oid);

  if (!user) {
    await createUser(oid, firstName, lastName, "", "", "");
    user = await getUser(oid);
  }

  return user;
}

export default middlewareAuth;
