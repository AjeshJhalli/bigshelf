import { Tenant, User } from "../../types/types.ts";
import Tenants from "../tenants/Tenants.tsx";
import AdminCommands from "./AdminCommands.tsx";
import UserProfile from "./UserProfile.tsx";

export default function Dashboard(
  { user, tenants }: { user: User; tenants: Array<Tenant> },
) {
  return (
    <div className="flex flex-wrap gap-3">
      <UserProfile user={user} />
      <Tenants activeTenantId={user.activeTenant} tenants={tenants} />
      <AdminCommands />
    </div>
  );
}
