import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function Customer(
  { oob = false, customer, emailAddresses },
) {
  return (
    <div
      id="customer-view-form"
      {...(oob ? { "hx-swap-oob": "true" } : {})}
      className="card rounded-none h-full"
    >
      <div className="card-body h-full">
        <div className="pb-10">
          <div className="card-actions justify-between">
            <h2 className="card-title py-3">
              {customer.name}
            </h2>
            <div className="flex gap-x-6">
              <button
                className="btn btn-primary btn-sm"
                hx-get={`/customers/${customer.id}/edit`}
                hx-target="body"
                hx-swap="beforeend"
              >
                Edit
              </button>
            </div>
          </div>
          <CustomerAddress address={customer.address} />
        </div>
        <div class="max-w-[800px] overflow-auto">
          <h2 class="text-md font-bold mb-4">Emails</h2>
          <table class="table table-fixed mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {emailAddresses.map((record) => (
                <CustomerEmailRow
                  label={record.label}
                  emailAddress={record.email_address}
                  customerId={record.customer_id}
                  emailAddressId={record.id}
                  defaultFlag={record.default_flag}
                />
              ))}
              <CustomerEmailLastRow customerId={customer.id} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerAddress({ address }) {
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

export function CustomerEmailRow(
  { label, emailAddress, customerId, emailAddressId, defaultFlag },
) {
  return (
    <tr>
      <td
        className={classNames("hover:bg-base-200 hover:cursor-pointer", {
          "font-bold text-primary": defaultFlag,
        })}
        hx-get={`/customers/${customerId}/email-addresses/${emailAddressId}/edit`}
        hx-swap="outerHTML"
        hx-target="closest tr"
      >
        {label}
      </td>
      <td
        className={classNames("hover:bg-base-200 hover:cursor-pointer", {
          "font-bold": defaultFlag,
        })}
        hx-get={`/customers/${customerId}/email-addresses/${emailAddressId}/edit`}
        hx-swap="outerHTML"
        hx-target="closest tr"
      >
        <a
          className={classNames({
            "text-primary": defaultFlag,
          }, { "text-blue-500": !defaultFlag })}
          href={`mailto:${emailAddress}`}
        >
          {emailAddress}
        </a>
      </td>
      <td className="flex justify-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-xs">Options</div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
          >
            <li>
              <a
                hx-post={`/customers/${customerId}/email-addresses/${emailAddressId}/make-default`}
                hx-target="#module-container"
              >
                Make default
              </a>
            </li>
            <li>
              <a
                hx-delete={`/customers/${customerId}/email-addresses/${emailAddressId}`}
                hx-confirm="Are you sure you want to delete this email address?"
                hx-target="closest tr"
                hx-swap="outerHTML"
              >
                Delete
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
}

export function CustomerEmailRowForm(
  { cancelHref, label, emailAddress, saveHref },
) {
  return (
    <tr>
      <td>
        <input
          autoFocus
          required
          name="label"
          type="text"
          class="input input-sm input-bordered"
          placeholder="Enter name"
          tabIndex="1"
          value={label}
        />
      </td>
      <td>
        <input
          required
          name="emailAddress"
          type="email"
          class="input input-sm input-bordered"
          placeholder="Enter email address"
          tabIndex="1"
          value={emailAddress}
        />
      </td>
      <td class="flex justify-end">
        <button
          type="button"
          class="btn btn-sm btn-error mr-3"
          hx-get={cancelHref}
          hx-target="closest tr"
          hx-swap="outerHTML"
          tabIndex="1"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          hx-post={saveHref}
          hx-include="closest tr"
          hx-target="closest tr"
          hx-swap="outerHTML"
          tabIndex="1"
        >
          Save
        </button>
      </td>
    </tr>
  );
}

export function CustomerEmailLastRow({ customerId }) {
  return (
    <tr id="customer-emails-bottom-row">
      <td>
      </td>
      <td>
      </td>
      <td class="flex justify-end">
        <button
          class="btn btn-sm btn-primary"
          hx-get={`/customers/${customerId}/email-new-row-form`}
          hx-target="#customer-emails-bottom-row"
          hx-swap="outerHTML"
        >
          New
        </button>
      </td>
    </tr>
  );
}
