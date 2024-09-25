import { User } from "../../types/types.ts";
import formatDate from "../../utils/formatDate.ts";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div
      id="user-profile-data-card"
      className="card rounded-none max-w-[600px] min-w-[400px]"
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
                <td>{user.firstName + " " + user.lastName}</td>
              </tr>
              <tr>
                <th>Job Title</th>
                <td>{user.jobTitle}</td>
              </tr>
              <tr>
                <th>DOB</th>
                <td>
                  {formatDate(user.dob)}
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{user.gender}</td>
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
