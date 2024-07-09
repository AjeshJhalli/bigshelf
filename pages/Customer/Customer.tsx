import { CustomerBookingsTab, CustomerPeopleTab } from "./CustomerTabs.tsx";
import Tabs from "../../components/Tabs.tsx";

export default function Customer({ customer, people }) {
  return (
    <div className="card bg-base-200 shadow-xl rounded-none">
      <div className="card-body">
        <div className="">
          <div className="card-actions justify-between">
            <h2 className="card-title py-3">
              {customer.value.name}
            </h2>
            <a
              className="btn btn-primary btn-sm"
              href={`/customers/${customer.key[2]}/edit`}
            >
              Edit
            </a>
          </div>
          <div className="flex gap-x-3">
            <CustomerAddress address={customer.value.address} />
          </div>
        </div>
        <Tabs
          selectedTabName="people"
          tabsId="customer-people-tab"
          tabs={[
            {
              displayName: "People",
              name: "people",
              content: CustomerPeopleTab,
              data: { people },
              href: `/customers/${customer.key[2]}/tab-people`,
            },
            {
              displayName: "Bookings",
              name: "bookings",
              content: CustomerBookingsTab,
              data: {},
              href: `/customers/${customer.key[2]}/tab-bookings`,
            },
          ]}
        />
      </div>
    </div>
  );
}

function CustomerAddress({ address }: any) {
  return (
    <address className="p-3 w-72 bg-base-100">
      <div>{address.line1}</div>
      <div>{address.line2}</div>
      <div>{address.city}</div>
      <div>{address.country}</div>
      <div>{address.postcode}</div>
    </address>
  );
}

function CustomerKeyContacts({ people }: any) {
  return (
    <div className="overflow-x-auto bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title / Contact Type</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover">
            <td>Olivia Rodrigo</td>
            <td>Key contact</td>
            <td>ajeshjhalli@gmail.com</td>
          </tr>
          <tr className="hover">
            <td>Info</td>
            <td></td>
            <td>ajeshjhalli@gmail.com</td>
          </tr>
          <tr className="hover">
            <td>Accounts</td>
            <td></td>
            <td>ajeshjhalli@gmail.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
