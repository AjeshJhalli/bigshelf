import Navbar from "./components/Navbar.jsx";

export default function Layout({ children }) {
  return (
    <html data-theme='light'>
      <head>
        <title>Bigshelf</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.11.1/dist/full.min.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <script src="https://unpkg.com/htmx.org@1.9.12" />
        <script src='/public/main.js' />
        <meta charSet='utf-8' />
      </head>
      <body className='flex flex-col h-screen bg-base-300'>
        <Navbar />
        <main className='flex flex-col flex-grow p-3'>
          {children}
        </main>
      </body>
    </html>
  );
}