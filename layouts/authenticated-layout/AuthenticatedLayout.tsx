import AuthenticatedNavbar from "./AuthenticatedNavbar.tsx";
import Head from "../Head.tsx";
import { JSX } from "preact/jsx-runtime";
import AuthenticatedSidebar from "./AuthenticatedSidebar.tsx";

export default function AuthenticatedLayout(
  { children }: { children: JSX.Element },
) {
  return (
    <html data-theme="light">
      <Head />
      <body className="flex flex-col bg-base-300 h-screen">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <AuthenticatedNavbar />
            <main className="flex flex-col flex-grow p-3 h-full">
              {children}
            </main>
          </div>
          <AuthenticatedSidebar />
        </div>
      </body>
    </html>
  );
}
