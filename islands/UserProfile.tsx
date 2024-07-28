import { User } from "../data/model.ts";
import formatDate from "../utils/formatDate.ts";
import { useState } from "preact/hooks";
import EditFormModal from "./EditFormModal.tsx";

export default function UserProfile({ user }: { user: User }) {
  const [editFormOpen, setEditFormOpen] = useState(false);

  return (
    <>
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
              onClick={() => setEditFormOpen(true)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      <EditFormModal
        formHref="/app/dashboard/me/edit"
        saveHref=""
        deleteHref=""
        title=""
        deleteConfirmation=""
        open={editFormOpen}
        setEditFormOpen={setEditFormOpen}
      />
    </>
  );
}
