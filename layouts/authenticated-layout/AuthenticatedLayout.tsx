import AuthenticatedNavbar from "./AuthenticatedNavbar.tsx";
import Head from "../Head.tsx";
import { JSX } from "preact/jsx-runtime";
import AuthenticatedSidebar from "./AuthenticatedSidebar.tsx";
import { Breadcrumb } from "../../types/types.ts";

export default function AuthenticatedLayout(
  { children, breadcrumbs = [], activeModule, initials }: {
    children: JSX.Element;
    breadcrumbs: Array<Breadcrumb>;
    activeModule: string;
    initials: string;
  },
) {
  return (
    <html data-theme="dark">
      <Head />
      <body className="flex flex-col bg-base-300 h-screen">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <AuthenticatedNavbar activeModule={activeModule} initials={initials} />
            {breadcrumbs.length > 0 && (
              <div className="breadcrumbs text-sm px-3 pt-6">
                <ul>
                  {breadcrumbs.map((breadcrumb) => (
                    <li>
                      <a className="link" href={breadcrumb.href}>{breadcrumb.displayName}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <main className="flex flex-col flex-grow px-3 pt-3 h-full">
              {children}
            </main>
          </div>
          <AuthenticatedSidebar />
        </div>
      </body>
    </html>
  );
}
