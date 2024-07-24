import { User } from "../../data/model.ts";

export default function Tenants(
  { activeTenantId, tenants }: { activeTenantId: string; tenants: Array<any> },
) {

  console.log(`Tenant data: ${tenants}`);
  console.log(activeTenantId);

  return (
    <div className="card bg-base-100 shadow-xl rounded-none max-w-[600px]">
      <div className="card-body">
        <h2 className="card-title">
          Your Tenants
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr className="">
                <td>
                  {tenant.value.name}
                </td>
                <td>
                  {tenant.value.description}
                </td>
                <td>
                  <input
                    type="radio"
                    name="tenant-selection"
                    className="radio checked:bg-blue-500"
                    checked={tenant.key[1] === activeTenantId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
