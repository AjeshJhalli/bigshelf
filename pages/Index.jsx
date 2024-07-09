const tenant = Deno.env.get("TENANT_NAME");
const clientId = Deno.env.get("APP_CLIENT_ID");
const policy = Deno.env.get("POLICY");
const redirectUri = Deno.env.get("APP_REDIRECT_URI");
const scope = "openid offline_access";

export default function Index() {
  return (
    <html>
      <head>
        <title>Bigshelf</title>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.11.1/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <script src="https://unpkg.com/htmx.org@1.9.12" />
        <meta charSet="utf-8" />
      </head>
      <body>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Bigshelf</h1>
              <p className="py-6">
                Bigshelf is a traveller profile management app for travel agencies.
              </p>
              <a className="btn btn-primary" href={`https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}`}>
                Sign in
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
