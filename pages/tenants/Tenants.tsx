import { User } from "../../data/model.ts";

export default function Tenants(
  { user, tenants }: { user: User; tenants: Array<any> },
) {
  return (
    <div>
      <h1>The tenants page</h1>
      <p>
        {JSON.stringify(user)}
      </p>
      <ul>
        {tenants.map(tenant => JSON.stringify(tenant))}
      </ul>
    </div>
  );
}
