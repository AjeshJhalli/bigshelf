// import { Middleware } from "https://deno.land/x/oak/mod.ts";
// import { decode } from "https://deno.land/x/djwt/mod.ts";

// const kv = await Deno.openKv();

// const xeroClientId = Deno.env.get("XERO_CLIENT_ID");
// const xeroClientSecret = Deno.env.get("XERO_CLIENT_SECRET");
// const xeroRedirectUri = Deno.env.get("XERO_REDIRECT_URI");

// // Middleware to authenticate users with Azure B2C
// const xeroUserAuth: Middleware = async (ctx, next) => {
//   if (ctx.request.url.pathname === "/") {
//     await next();
//     return;
//   }

//   const idToken = await ctx.cookies.get("id_token");

//   if (!idToken) {
//     // Redirect to Xero
//     const authUrl =
//       `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}`;
//     ctx.response.redirect(authUrl);
//     return;
//   }

//   try {
//     // Validate the token
//     const payload = decode(token)[1];
//     const exp = payload.exp;
//     const now = Math.floor(Date.now() / 1000);

//     if (exp < now) {
//       // Token is expired, try to refresh
//       if (!refreshToken) {
//         throw new Error("Refresh token not found");
//       }

//       const tokenResponse = await fetch(
//         `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             client_id: clientId,
//             scope: scope,
//             refresh_token: refreshToken,
//             grant_type: "refresh_token",
//             client_secret: clientSecret,
//           } as Record<string, string>),
//         },
//       );

//       const tokenData = await tokenResponse.json();
//       if (!tokenResponse.ok) {
//         throw new Error(tokenData.error_description || "Token refresh failed");
//       }

//       await ctx.cookies.set("id_token", tokenData.id_token, { httpOnly: true });
//       await ctx.cookies.set("refresh_token", tokenData.refresh_token, {
//         httpOnly: true,
//       });

//       ctx.state.user = await setUser(tokenData.id_token);
//     } else {
//       ctx.state.user = await setUser(token);
//     }

//     await next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     ctx.response.status = 401;
//     ctx.response.body = { error: "Authentication required" };
//   }
// };

// const handleXeroCallback: Middleware = async (context) => {
//   const code = context.request.url.searchParams.get("code");

//   if (!code) {
//     context.response.status = 400;
//     context.response.body = { error: "Code not found" };
//     return;
//   }

//   const tokenResponse = await fetch(
//     `https://identity.xero.com/connect/token`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Authorization": `Basic ${btoa(`${xeroClientId}:${xeroClientSecret}`)}`,
//       },
//       body: new URLSearchParams({
//         code: code,
//         redirect_uri: xeroRedirectUri,
//         grant_type: "authorization_code",
//       } as Record<string, string>),
//     },
//   );

//   const tokenData = await tokenResponse.json();

//   if (!tokenResponse.ok) {
//     context.response.status = 401;
//     context.response.body = {
//       error: tokenData.error_description || "Token exchange failed",
//     };
//     return;
//   }

//   // If token retrieval was successful, create or update user record with tokens
//   // Then send ID token to browser as a cookie

//   const {
//     access_token: accessToken,
//     id_token: idToken,
//     expires_in: expiresIn,
//     refresh_token: refreshToken,
//   } = tokenData.accessToken;

//   console.log(accessToken);


//   const user = await kv.get(["user", idToken]);


//   await context.cookies.set("refresh_token", tokenData.refresh_token, {
//     httpOnly: true,
//   });
//   await context.cookies.set("id_token", tokenData.id_token, { httpOnly: true });

//   context.response.redirect("/dashboard");
// };

// async function setUser(idToken: string) {
//   const payload = decode(idToken)[1];

//   const oid = payload.oid;
//   const firstName = payload.given_name;
//   const lastName = payload.family_name;

//   let user = await kv.get(["user", oid]);

//   if (!user) {
//     await kv.set(["user", oid], {
//       firstName,
//       lastName,
//     });
//     user = await kv.get(["user", oid]);
//   }

//   return user;
// }

// export { azureB2CAuth, handleAzureB2CCallback };
