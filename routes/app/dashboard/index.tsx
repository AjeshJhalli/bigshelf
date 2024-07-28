import { RouteContext } from "$fresh/server.ts";
import Dashboard from "../../../pages/dashboard/Dashboard.tsx";
import { User } from "../../../data/model.ts";

const kv = await Deno.openKv();
export default async function Home(request: Request, context: RouteContext) {
  context.state.activeModule = "dashboard";
  context.state.breadcrumbs = [
    { displayName: "Dashboard", href: request.url },
  ];

  const userRecord = await kv.get(["user", context.state.user.oid]);
  const user = userRecord.value as User;

  const tenants = [];

  for (const tenantId of user.tenants) {
    const tenant = await kv.get(["tenant", tenantId]);
    tenants.push(tenant);
  }

  return <Dashboard user={user} tenants={tenants} />;
}
