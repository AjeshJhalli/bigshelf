export default function People({ people }) {
  return (
    <>
      <div className="card bg-base-100 shadow-lg flex flex-grow">
        <div className="card-body">
          <h2 className="card-title flex justify-between">
            <span>People</span>
            <div className="card-actions">
              <a className="btn btn-sm" href="/people/new">New Person</a>
            </div>
          </h2>
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
