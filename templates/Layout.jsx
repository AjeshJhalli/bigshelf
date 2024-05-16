export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>Bigshelf</title>
        <link
          href='https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
          rel='stylesheet'
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <script src="https://unpkg.com/htmx.org@1.9.12" />
        <script src='/public/main.js' />
        <meta charSet='utf-8' />
      </head>
      <body className='flex flex-col h-screen bg-blue-50'>
        <nav className='border-b border-gray-300 px-3 py-2 shadow bg-white'>
          <a href='/'>
            <h1>Bigshelf</h1>
          </a>
        </nav>
        <main className='flex flex-col flex-grow p-3'>
          {children}
        </main>
      </body>
    </html>
  );
}