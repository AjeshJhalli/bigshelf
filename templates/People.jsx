export default function People({ people }) {
  return (
    <>
      <h2 className="text-sm breadcrumbs">
        <ul>
          <li>
            <a href="/people">People</a>
          </li>
        </ul>
      </h2>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="card-actions">
            <a className="btn btn-sm" href='/people/new'>New Person</a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>DOB</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  // <li className="hover:bg-gray-200">
                  //   <a href={`/people/${person.id}`}>
                  //     {person.firstName} {person.lastName} (DOB {person.dob})
                  //   </a>
                  // </li>
                  <tr>
                    <td>
                      {person.id}
                    </td>
                    <td>
                      {person.firstName} {person.lastName}
                    </td>
                    <td>
                      {person.jobTitle}
                    </td>
                    <td>
                      {person.dob}
                    </td>
                    <td>
                      <a
                        className="w-full text-blue-600"
                        href={`/people/${person.id}`}
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
