import { FreshContext } from "$fresh/server.ts";
import { User } from "../../../data/model.ts";
import { Breadcrumb } from "../../../types/types.ts";

export interface State {
  data: string;
  user?: User | null;
  activeModule?: string;
  breadcrumbs?: Array<Breadcrumb>;
}

export async function handler(
  _request: Request,
  context: FreshContext<State>,
) {
  context.state.activeModule = "dashboard";
  context.state.breadcrumbs = [
    { displayName: "Dashboard", href: "/app/dashboard" },
  ];

  return await context.next();
}
