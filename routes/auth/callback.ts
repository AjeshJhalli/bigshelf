import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const clientSecret = Deno.env.get("APP_CLIENT_SECRET");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

export const handler: Handlers = {
  async GET(request, _context) {
    const code = new URL(request.url).searchParams.get("code");

    if (!code) {
      return new Response("Authorization code was not found", {
        status: 400,
      });
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
      return new Response("Token exchange failed", {
        status: 401,
      });
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

    headers.set("location", "/app/dashboard");

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
