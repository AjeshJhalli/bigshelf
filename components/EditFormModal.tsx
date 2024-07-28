import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export type FormField = FieldText | FieldDropdown | FieldDate;

export type FieldText = {
  type: "text";
  name: string;
  displayName: string;
  value: string;
  required?: boolean;
};

export type FieldDropdownOption = {
  displayName: string;
  value: string;
};

export type FieldDropdown = {
  type: "dropdown";
  name: string;
  displayName: string;
  options: Array<FieldDropdownOption>;
  value: string;
};

export type FieldDate = {
  type: "date";
  displayName: string;
  name: string;
  day: string;
  month: string;
  year: string;
};

function field(field: FormField) {
  switch (field.type) {
    case "text":
      return (
        <FieldText
          type={field.type}
          name={field.name}
          displayName={field.displayName}
          value={field.value}
        />
      );
    case "dropdown":
      return field.options.length
        ? (
          <FieldDropdown
            type={field.type}
            name={field.name}
            displayName={field.displayName}
            options={field.options}
            value={field.value}
          />
        )
        : JSON.stringify(field);
    case "date":
      return (
        <FieldDate
          type={field.type}
          displayName={field.displayName}
          name={field.name}
          day={field.day}
          month={field.month}
          year={field.year}
        />
      );
  }

  return <div>Error</div>;
}

function FieldText(
  { name, displayName, value }: FieldText,
) {
  return (
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">{displayName}</span>
      </div>
      <input
        type="text"
        placeholder={displayName}
        name={name}
        className="input input-sm input-bordered w-full max-w-xs"
        value={value}
      />
    </label>
  );
}

function FieldDropdown({ name, displayName, options, value }: FieldDropdown) {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{displayName}</span>
      </div>
      <select className="select select-sm select-bordered" name={name}>
        <option disabled selected={!value}>{displayName}</option>
        {options.map((option) => (
          <option selected={option.value === value} value={option.value}>
            {option.displayName}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldDate({ displayName, name, day, month, year }: FieldDate) {
  const days = [...Array(32).keys()].slice(1).map((year) => year.toString());

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = (new Date()).getFullYear();

  const years = [...Array(currentYear + 1).keys()].slice(currentYear - 149)
    .toReversed().map((year) => year.toString());

  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{displayName}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-1 w-full">
        <select
          className="select select-sm select-bordered"
          name={`${name}Day`}
        >
          <option disabled selected={day === ""}>Day</option>
          {days.map((d) => (
            <option selected={d === day}>
              {d}
            </option>
          ))}
        </select>
        <select
          className="select select-sm select-bordered"
          name={`${name}Month`}
        >
          <option disabled selected={month === ""}>Month</option>
          {months.map((m) => (
            <option selected={m === month}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="select select-sm select-bordered"
          name={`${name}Year`}
        >
          <option disabled selected={year === ""}>Year</option>
          {years.map((y) => (
            <option selected={y === year}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

export default function EditFormModal(
  { fields, saveHref, title, deleteHref, deleteConfirmation }: {
    fields: Array<FormField>;
    saveHref: string;
    title: string;
    deleteHref?: string;
    deleteConfirmation?: string;
  },
) {
  return (
    <div
      id="edit-form-modal"
      className="modal modal-open"
      _={"on closeModal add .closing then wait for animationend then remove me"}
    >
      <form
        id="user-profile-edit-form"
        className="modal-box bg-base-100 shadow-xl"
        method="POST"
        action={saveHref}
      >
        <div className="card-body flex">
          <div className={classNames("card-actions", {
            "justify-between": deleteHref,
            "justify-end": !deleteHref
          })}>
            {deleteHref && (
              <button
                type="button"
                className="btn btn-error btn-sm mr-10"
                hx-delete={deleteHref}
                hx-confirm={deleteConfirmation}
              >
                Delete
              </button>
            )}
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick="document.getElementById('edit-form-modal').remove()"
              >
                Cancel
              </button>
              <button className="btn btn-primary btn-sm">
                Save
              </button>
            </div>
          </div>
          <h2 className="card-title">{title}</h2>
          <div className="form-control flex flex-col gap-y-1 justify-start items-start">
            {fields.map(field)}
          </div>
        </div>
      </form>
    </div>
  );
}
