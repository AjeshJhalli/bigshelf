export default function LayoutAuth({ children }) {
  return (
    <html data-theme="light">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.11.1/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold pb-20">Bigshelf</h1>              
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
