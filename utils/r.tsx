import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import AuthenticatedLayout from "../layouts/authenticated-layout/AuthenticatedLayout.tsx";
import { JSX } from "preact/jsx-runtime";
import { Breadcrumb } from "../types/types.ts";

export default function r(
  component: JSX.Element,
  breadcrumbs: Array<Breadcrumb> = [],
  activeModule: string,
  activeTenant: string,
) {
  return render(
    <AuthenticatedLayout breadcrumbs={breadcrumbs} activeModule={activeModule} activeTenant={activeTenant}>
      {component}
    </AuthenticatedLayout>
  );
}
