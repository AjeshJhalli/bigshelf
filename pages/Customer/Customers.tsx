import ButtonNew from "../../components/ButtonNew.tsx";
import { CustomerType } from "../../types/types.ts";
import addressLateral from "../../utils/addressLateral.ts";

export default function Customers(
  { customers }: {
    customers: Array<CustomerType>;
  },
) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Customers</span>
          <div className="card-actions">
            <ButtonNew href="/customers/new" />
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
                  hx-get={`/customers/${customer.id}`}
                  hx-target="#module-container"
                  hx-push-url="true"
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
