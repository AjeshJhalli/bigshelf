import { CustomerPeopleTab } from "./CustomerTabs.tsx";
import Tabs from "../../components/Tabs.tsx";
import { CustomerRecord } from "../../types/types.ts";
import { PersonRecord } from "../../types/types.ts";
import { Address } from "../../types/types.ts";

export default function Customer(
  { customer, people }: {
    customer: CustomerRecord;
    people: Array<PersonRecord>;
  },
) {
  return (
    <div className="card bg-base-100 shadow-xl rounded-none h-full">
      <div className="card-body h-full">
        <div className="h-full">
          <div className="card-actions justify-between">
            <h2 className="card-title py-3">
              {customer.value.name}
            </h2>
            <div className="flex gap-x-6">
              <button
                className="btn btn-primary btn-sm"
                hx-get={`/customers/${customer.key[2]}/edit`}
                hx-target="body"
                hx-swap="beforeend"
              >
                Edit
              </button>
              <button
                className="btn btn-primary btn-sm"
                hx-delete={`/customers/${customer.key[2]}`}
                hx-confirm="Are you sure you want to delete this customer?"
              >
                Delete
              </button>
            </div>
          </div>
          <CustomerAddress address={customer.value.address} />
        </div>
        <Tabs
          tabsId="customer-people-tab"
          tabs={[
            {
              displayName: "People",
              name: "people",
              content: (
                <CustomerPeopleTab
                  customerId={customer.key[2]}
                  people={people}
                />
              ),
              href: `/customers/${customer.key[2]}/tab-people`,
              selected: true,
            },
            {
              displayName: "Bookings",
              name: "bookings",
              href: `/customers/${customer.key[2]}/tab-bookings`,
            },
          ]}
        />
      </div>
    </div>
  );
}

function CustomerAddress({ address }: { address: Address }) {
  return (
    <address className="w-72">
      <div>{address.line1}</div>
      <div>{address.line2}</div>
      <div>{address.city}</div>
      <div>{address.country}</div>
      <div>{address.postcode}</div>
    </address>
  );
}
