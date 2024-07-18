export default function UserProfile({ user }) {
  return (
    <div
      id="user-profile-data-card"
      className="card bg-base-100 shadow-xl rounded-none max-w-[600px]"
    >
      <div className="card-body">
        <h2 className="card-title">
          User Profile
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-sm border-separate">
            <tbody>
              <tr>
                <th>Full Name</th>
                <td>{user.value.firstName + " " + user.value.lastName}</td>
              </tr>
              <tr>
                <th>Job Title</th>
                <td>{user.value.jobTitle}</td>
              </tr>
              <tr>
                <th>DOB</th>
                <td>
                  {user.value.dob}
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{user.value.gender}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            hx-get="/dashboard/me/edit"
            hx-target="body"
            hx-swap="beforeend"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
