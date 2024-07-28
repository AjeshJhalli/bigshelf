const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

const authUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scope}`;

export default authUrl;
