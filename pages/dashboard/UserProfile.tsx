export default function UserProfile({ user }) {

  if (!user?.value) return <p>{user}</p>;

  return (
    <div id="user-profile-data-card" className="card bg-base-100 shadow-xl rounded-none">
      <div className="card-body">
        <h2 className="card-title">
          User Profile
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-sm">
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
                  {new Date(user.value.dob).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
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
          <a
            className="btn btn-primary btn-sm"
            href="/dashboard/me/edit"
          >
            Edit
          </a>
        </div>
      </div>
    </div>
  );
}
