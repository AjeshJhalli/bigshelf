import { CustomerType } from "../../types/types.ts";
import addressLateral from "../../utils/addressLateral.ts";

export default function Customers(
  { customers, activeTenant }: {
    customers: Array<CustomerType>;
    activeTenant: string;
  },
) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Customers</span>
          <div className="card-actions">
            <a
              className="btn btn-sm btn-primary"
              hx-get={`/${activeTenant}/customers/new`}
              hx-target="body"
              hx-swap="beforeend"
            >
              New
            </a>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  className="hover:bg-base-200 hover:cursor-pointer"
                  onClick={`window.location.href='/${activeTenant}/customers/${
                    customer.id
                  }'`}
                >
                  <td>
                    {customer.name}
                  </td>
                  <td>
                    {addressLateral(customer.address)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
