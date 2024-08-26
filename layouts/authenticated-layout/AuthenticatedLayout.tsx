import AuthenticatedNavbar from "./AuthenticatedNavbar.tsx";
import Head from "../Head.tsx";
import { JSX } from "preact/jsx-runtime";
import AuthenticatedSidebar from "./AuthenticatedSidebar.tsx";

export default function AuthenticatedLayout(
  { children, activeModule }: {
    children: JSX.Element;
    activeModule: string;
  },
) {
  return (
    <html data-theme="dim">
      <Head />
      <body className="flex flex-col bg-base-200 h-screen">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <AuthenticatedNavbar activeModule={activeModule} />
            <main id="module-container" className="flex flex-col flex-grow px-6 pt-3 h-full">
              {children}
            </main>
          </div>
          <AuthenticatedSidebar activeModule={activeModule} />
        </div>
      </body>
    </html>
  );
}
