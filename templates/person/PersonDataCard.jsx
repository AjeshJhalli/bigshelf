export default function PersonDataCard({ person }) {
  return (
    <div id="person-data-card" className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {person.firstName + " " + person.lastName}
        </h2>
        <div class="text-sm opacity-50">{person.jobTitle}</div>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <th>Person ID</th>
                <td>{person.id}</td>
              </tr>
              <tr>
                <th>Full Name</th>
                <td>{person.firstName + " " + person.lastName}</td>
              </tr>
              <tr>
                <th>Job Title</th>
                <td>{person.jobTitle}</td>
              </tr>
              <tr>
                <th>DOB</th>
                <td>
                  {new Date(person.dob).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{person.gender}</td>
              </tr>
            </tbody>
          </table>
          <div className="divider" />
          <div className="flex gap-x-6 items-start">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>
                    Email Addresses
                  </th>
                </tr>
              </thead>
              <tbody>
                {person.emailAddresses.map((emailAddress) => (
                  <tr>
                    <td>
                      {emailAddress.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Phone Numbers</th>
                </tr>
              </thead>
              <tbody>
                {person.phoneNumbers.map((phoneNumbers) => (
                  <tr>
                    <td>
                      {phoneNumbers.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            hx-get={`/people/${person.id}/edit-form`}
            hx-target="#person-data-card"
            hx-swap="outerHTML"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
