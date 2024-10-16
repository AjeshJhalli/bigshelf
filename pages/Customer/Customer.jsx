import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function Customer(
  { oob = false, customer, emailAddresses, phoneNumbers },
) {
  return (
    <div
      id="customer-view-form"
      {...(oob ? { "hx-swap-oob": "true" } : {})}
      className="card rounded-none h-full"
    >
      <div className="card-body h-full max-w-[1000px]">
        <div className="pb-10">
          <div className="card-actions justify-between">
            <CustomerMain
              customerId={customer.id}
              name={customer.name}
              defaultEmail={emailAddresses.find((email) => email.default_flag)
                ?.email_address}
            />
          </div>
        </div>
        <CustomerTabs
          customerId={customer.id}
          tabName="emails"
          records={emailAddresses}
        />
      </div>
    </div>
  );
}

export function CustomerTabs({ customerId, tabName, records }) {
  return (
    <div id="customer-tabs" role="tablist" className="tabs tabs-bordered">
      <a
        hx-get={`/customers/${customerId}/email-addresses`}
        hx-target="#customer-tabs"
        hx-swap="outerHTML"
        name="my_tabs_1"
        role="tab"
        className={classNames("tab", { "tab-active": tabName === "emails" })}
      >
        Emails
      </a>
      <div
        role="tabpanel"
        className="tab-content py-6"
      >
        {tabName === "emails" && (
          <TabEmailAddresses customerId={customerId} emailAddresses={records} />
        )}
      </div>
      <a
        hx-get={`/customers/${customerId}/phone-numbers`}
        hx-target="#customer-tabs"
        hx-swap="outerHTML"
        name="my_tabs_1"
        role="tab"
        className={classNames("tab w-40", {
          "tab-active": tabName === "phone-numbers",
        })}
      >
        Phone Numbers
      </a>
      <div
        role="tabpanel"
        className="tab-content py-6"
      >
        {tabName === "phone-numbers" && (
          <TabPhoneNumbers customerId={customerId} phoneNumbers={records} />
        )}
      </div>
    </div>
  );
}

function TabEmailAddresses({ customerId, emailAddresses }) {
  return (
    <table class="table table-fixed">
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
            customerId={customerId}
            emailAddressId={record.id}
            defaultFlag={record.default_flag}
          />
        ))}
        <CustomerEmailLastRow customerId={customerId} />
      </tbody>
    </table>
  );
}

function TabPhoneNumbers({ customerId, phoneNumbers }) {
  return <div>Phone numbers coming soon</div>;
}

export function CustomerMain({ customerId, name, defaultEmail }) {
  return (
    <div
      class="flex flex-col w-full card "
      id="customer-main"
    >
      <div class="grid grid-cols-2 max-w-[500px] px-3 items-center gap-y-2 py-3">
        <span class="font-bold text-gray-400 text-sm">Name</span>
        <span>
          {name}
        </span>
        <span class="font-bold text-gray-400 text-sm">Email</span>
        <a class="link text-blue-500" href={`mailto:${defaultEmail}`}>
          {defaultEmail}
        </a>
        {/* <span class="font-bold text-gray-400 text-sm">Phone Number</span> */}
        {/* <span>+44 7488 290928</span> */}
      </div>
      <div className="card-actions justify-end">
        <button
          class="btn btn-primary btn-sm self-end"
          hx-get={`/customers/${customerId}/main/edit`}
          hx-target="#customer-main"
          hx-swap="outerHTML"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
export function CustomerNameForm(
  { name, saveHref, cancelHref, emailAddresses },
) {
  return (
    <form
      class="flex flex-col w-full"
      hx-post={saveHref}
      // hx-swap="outerHTML"
      hx-target="#module-container"
    >
      <div class="grid grid-cols-2 max-w-[500px] px-3 items-center gap-y-2 py-3">
        <span class="font-bold text-gray-400 text-sm">Name</span>
        <input
          class="input input-sm input-bordered"
          value={name}
          name="customerName"
        />
        <span class="font-bold text-gray-400 text-sm">Email</span>
        <select class="select select-sm select-bordered" name="emailAddress">
          {emailAddresses.map((email) => (
            <option value={email.id} selected={email.default_flag}>
              {email.email_address}
            </option>
          ))}
        </select>
        {/* <span class="font-bold text-gray-400 text-sm">Phone Number</span>
        <input
          class="input input-sm input-bordered"
          value="+44 7488 290928"
          name="phoneNumber"
        /> */}
      </div>
      <div className="card-actions justify-end">
        <button
          class="btn btn-sm btn-error mr-3"
          type="button"
          hx-get={cancelHref}
          hx-target="closest form"
          hx-swap="outerHTML"
          tabIndex="0"
        >
          Cancel
        </button>
        <button class="btn btn-sm btn-primary" type="submit" tabIndex="0">
          Save
        </button>
      </div>
    </form>
  );
}

export function CustomerEmailRow(
  { label, emailAddress, emailAddressId, defaultFlag },
) {
  return (
    <tr>
      <td
        className={classNames({
          "font-bold text-primary": defaultFlag,
        })}
      >
        {label}
      </td>
      <td
        className={classNames({
          "font-bold": defaultFlag,
        })}
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
                hx-get={`/email-addresses/${emailAddressId}/edit`}
                hx-target="closest tr"
                hx-swap="outerHTML"
              >
                Edit
              </a>
            </li>
            <li>
              <a
                hx-post={`/email-addresses/${emailAddressId}/make-default`}
                hx-target="#module-container"
              >
                Make default
              </a>
            </li>
            <li>
              <a
                hx-delete={`/email-addresses/${emailAddressId}`}
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

export function CustomerPhoneNumberRow(
  { label, phoneNumber, customerId, phoneNumberId, defaultFlag },
) {
  return (
    <tr>
      <td
        className={classNames({
          "font-bold text-primary": defaultFlag,
        })}
      >
        {label}
      </td>
      <td
        className={classNames({
          "font-bold": defaultFlag,
        })}
      >
        <a
          className={classNames({ "text-primary": defaultFlag })}
        >
          {phoneNumber}
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
                hx-post={`/customers/${customerId}/email-addresses/${phoneNumberId}/make-default`}
                hx-target="#module-container"
              >
                Make default
              </a>
            </li>
            <li>
              <a
                hx-delete={`/customers/${customerId}/email-addresses/${phoneNumberId}`}
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

export function CustomerPhoneNumberLastRow({ customerId }) {
  return (
    <tr id="customer-phone-number-bottom-row">
      <td>
      </td>
      <td>
      </td>
      <td class="flex justify-end">
        <button
          class="btn btn-sm btn-primary"
          hx-get={`/customers/${customerId}/phone-number-new-row-form`}
          hx-target="#customer-phone-number-bottom-row"
          hx-swap="outerHTML"
        >
          New
        </button>
      </td>
    </tr>
  );
}
