import CustomerPeople from "./CustomerPeople.tsx";
import { CustomerType, Person } from "../../types/types.ts";
import { Address } from "../../types/types.ts";

export default function Customer(
  { customer, people, activeTenant }: {
    customer: CustomerType;
    people: Array<Person>;
    activeTenant: string;
  },
) {
  return (
    <div className="card bg-base-100 shadow-xl rounded-none h-full">
      <div className="card-body h-full">
        <div className="pb-10">
          <div className="card-actions justify-between">
            <h2 className="card-title py-3">
              {customer.name}
            </h2>
            <div className="flex gap-x-6">
              <button
                className="btn btn-primary btn-sm"
                hx-get={`/${activeTenant}/customers/${customer.id}/edit`}
                hx-target="body"
                hx-swap="beforeend"
              >
                Edit
              </button>
            </div>
          </div>
          <CustomerAddress address={customer.address} />
        </div>
        <CustomerPeople
          customerId={customer.id}
          people={people}
          activeTenant={activeTenant}
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
