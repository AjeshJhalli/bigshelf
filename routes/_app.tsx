import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body data-theme="dark">
        <Component />
      </body>
    </html>
  );
}
