export type FormField = {
  type: string;
  name: string;
  displayName: string;
  value: string;
  options: Array<FieldDropdownOption>;
  day: string;
  month: string;
  year: string;
};

export type FieldText = {
  name: string;
  displayName: string;
  value: string;
};

export type FieldDropdownOption = {
  displayName: string;
  value: string;
};

export type FieldDropdown = {
  name: string;
  displayName: string;
  options: Array<FieldDropdownOption>;
  value: string;
};

export type FieldDate = {
  displayName: string;
  name: string;
  day: string;
  month: string;
  year: string;
};

export default function EditForm(
  { fields, cancelHref, saveHref, title }: {
    fields: Array<FormField>;
    cancelHref: string;
    saveHref: string;
    title: string;
  },
) {
  return (
    <form
      id="user-profile-edit-form"
      className="card bg-base-100 shadow-xl"
      method="POST"
      action={saveHref}
    >
      <div className="card-body flex">
        <h2 className="card-title">{title}</h2>
        <div className="form-control flex flex-col gap-y-1 justify-start items-start">
          {fields.map(field)}
        </div>
        <div className="card-actions justify-end">
          <a className="btn btn-primary btn-sm" href={cancelHref}>
            Cancel
          </a>
          <button className="btn btn-primary btn-sm">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function field(field: FormField) {
  switch (field.type) {
    case "text":
      return (
        <FieldText
          name={field.name}
          displayName={field.displayName}
          value={field.value}
        />
      );
    case "dropdown":
      return field.options.length
        ? (
          <FieldDropdown
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
        <select className="select select-sm select-bordered" name={`${name}Day`}>
          <option disabled selected={day === ""}>Day</option>
          {days.map((d) => (
            <option selected={d === day}>
              {d}
            </option>
          ))}
        </select>
        <select className="select select-sm select-bordered" name={`${name}Month`}>
          <option disabled selected={month === ""}>Month</option>
          {months.map((m) => (
            <option selected={m === month}>
              {m}
            </option>
          ))}
        </select>
        <select className="select select-sm select-bordered" name={`${name}Year`}>
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
