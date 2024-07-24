import { User } from "../../data/model.ts";
import Tenants from "../Tenants/Tenants.tsx";
import UserProfile from "./UserProfile.tsx";

export default function Dashboard(
  { user, tenants }: { user: User; tenants: Array<any> },
) {
  return (
    <div className="flex flex-col gap-y-3">
      <UserProfile user={user} />
      <Tenants activeTenantId={user.activeTenant} tenants={tenants} />
    </div>
  );
}
