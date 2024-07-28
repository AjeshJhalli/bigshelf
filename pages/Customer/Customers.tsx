import { CustomerRecord } from "../../types/types.ts";
import addressLateral from "../../utils/addressLateral.ts";

export default function Customers(
  { customers }: { customers: Array<CustomerRecord> },
) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Customers</span>
          <div className="card-actions">
            <a
              className="btn btn-sm btn-primary"
              hx-get="/customers/new"
              hx-target="body"
              hx-swap="beforeend"
            >
              New Customer
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
                  onClick={`window.location.href='/customers/${
                    customer.key[2]
                  }'`}
                >
                  <td>
                    {customer.value.name}
                  </td>
                  <td>
                    {addressLateral(customer.value.address)}
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
