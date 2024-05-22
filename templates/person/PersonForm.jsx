export default function PersonForm({ person }) {
  return (
    <form id="person-edit-form" className="card bg-base-100 shadow-xl">
      <div className="card-body flex">
        <h2 className="card-title">Person Edit</h2>
        <div class="text-sm opacity-50">
          {person.firstName} {person.lastName}
        </div>
        <div className="form-control flex flex-col gap-y-1 justify-start items-start">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">First Name</span>
            </div>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              className="input input-sm input-bordered w-full max-w-xs"
              value={person.firstName}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Last Name</span>
            </div>
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              className="input input-sm input-bordered w-full max-w-xs"
              value={person.lastName}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Job Title</span>
            </div>
            <input
              type="text"
              placeholder="Job Title"
              name="jobTitle"
              className="input input-sm input-bordered w-full max-w-xs"
              value={person.jobTitle}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">DOB</span>
            </div>
            <input
              type="date"
              placeholder="DOB"
              name="dob"
              className="input input-sm input-bordered w-full max-w-xs"
              value={person.dob}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Gender</span>
            </div>
            <select class="select select-sm select-bordered" name="gender">
              <option disabled selected={!['Male', 'Female'].includes(person.gender)}>Gender</option>
              <option selected={person.gender === 'Male'}>Male</option>
              <option selected={person.gender === 'Female'}>Female</option>
            </select>
          </label>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            type="button"
            hx-get={`/people/${person.id}/cancel-edit`}
            hx-target="#person-edit-form"
            hx-swap="outerHTML"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            hx-post={`/people/${person.id}/edit`}
            hx-target="#person-edit-form"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
