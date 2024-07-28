import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { decode } from "https://deno.land/x/djwt/mod.ts";
import createUser from "../../data/createUser.ts";
import getUser from "../../data/getUser.ts";
import { User } from "../../data/model.ts";
import { Breadcrumb } from "../../types/types.ts";

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const scope = "openid offline_access";

export interface State {
  data: string;
  user?: User | null;
  activeModule?: string;
  breadcrumbs?: Array<Breadcrumb>;
}

export async function handler(
  request: Request,
  context: FreshContext<State>,
) {
  const cookies = getCookies(request.headers);

  const token = cookies.id_token;
  const refreshToken = cookies.refresh_token;

  if (!token) {
    const headers = new Headers();
    headers.set("location", "/");

    return new Response(null, {
      status: 303,
      headers,
    });
  }

  try {
    const payload = decode(token)[1];
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp < now) {
      // Token is expired, try to refresh
      if (!refreshToken) {
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
        throw new Error(tokenData.error_description || "Token refresh failed");
      }

      const headers = new Headers();

      setCookie(headers, {
        name: "id_token",
        value: tokenData.id_token,
        sameSite: "Lax",
        domain: new URL(request.url).hostname,
        secure: true,
      });

      setCookie(headers, {
        name: "refresh_token",
        value: tokenData.refresh_token,
        sameSite: "Lax",
        domain: new URL(request.url).hostname,
        secure: true,
      });

      context.state.user = await setUser(tokenData.id_token);
    } else {
      context.state.user = await setUser(token);
    }

    const path = new URL(request.url).pathname.split("/");

    if (path[2] === "dashboard") {
      //
    } else if (path[3] === "customers") {
      context.state.activeModule = "customers";
    }

    return await context.next();
  } catch (err) {
    console.error(err);
    return new Response("Authentication required", {
      status: 401,
    });
  }
}

async function setUser(idToken: string) {
  const payload = decode(idToken)[1];

  if (!payload) return;

  const oid = payload.oid;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  let user = await getUser(oid);

  if (!user) {
    await createUser(oid, firstName, lastName, "", "", "");
    user = await getUser(oid);

    if (!user) return;
  }

  user.initials = `${user.firstName[0]}${user.lastName[0]}`;

  return user;
}
