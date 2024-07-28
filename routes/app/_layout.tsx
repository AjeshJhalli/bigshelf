import { Breadcrumb } from "../../types/types.ts";
import AuthenticatedNavbar from "../../layouts/authenticated-layout/AuthenticatedNavbar.tsx";
import AuthenticatedSidebar from "../../layouts/authenticated-layout/AuthenticatedSidebar.tsx";
import { PageProps } from "$fresh/server.ts";
import { User } from "../../data/model.ts";

export interface AppLayoutState {
  user: User;
  breadcrumbs: Array<Breadcrumb>;
}

export default function Layout(
  { Component, state }: PageProps
) {

  return (
    <div className="flex flex-col bg-base-300 h-screen">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <AuthenticatedNavbar
            activeModule={state.activeModule}
            initials={state.user.initials}
          />
          {state.breadcrumbs.length > 0 && (
            <div className="breadcrumbs text-sm px-6 pt-6">
              <ul>
                {state.breadcrumbs.map((breadcrumb) => (
                  <li>
                    <a className="link" href={breadcrumb.href}>
                      {breadcrumb.displayName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <main className="flex flex-col flex-grow px-6 pt-3 h-full">
            <Component />
          </main>
        </div>
        <AuthenticatedSidebar />
      </div>
    </div>
  );
}
