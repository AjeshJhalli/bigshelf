export default function Customers({ customers }) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Customers</span>
          <div className="card-actions">
            <a className="btn btn-sm" href="/people/new">New Customer</a>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
                    {customer.key[2]}
                  </td>
                  <td>
                    {customer.value.name}
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
