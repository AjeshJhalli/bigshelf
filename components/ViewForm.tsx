type Record = {
  editHref: string;
  fields: Array<any>;
};

type ViewFormProps = {
  title: string;
  newHref: string;
  columns: Array<string>;
  records: Array<Record>;
};

export default function ViewForm(
  { title, newHref, columns, records }: ViewFormProps,
) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>{title}</span>
          <div className="card-actions">
            <a
              className="btn btn-sm btn-primary"
              hx-get={newHref}
              hx-target="body"
              hx-swap="beforeend"
            >
              New
            </a>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {columns.map((column) => <th>{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  className="hover:bg-base-200 hover:cursor-pointer"
                  hx-get={record.editHref}
                  hx-target="body"
                  hx-swap="beforeend"
                >
                  {record.fields.map((field) => (
                    <td>
                      {field}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
