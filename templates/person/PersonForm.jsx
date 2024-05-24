export default function PersonForm({ person, newPerson }) {
  return (
    <form
      id="person-edit-form"
      className="card bg-base-100 shadow-xl"
      method="POST"
      action={newPerson ? '/people/new' : `/people/${person.id}`}
    >
      <div className="card-body flex">
        <h2 className="card-title">Person Edit</h2>
        <div class="text-sm opacity-50">
          {newPerson ? "New Person" : person.firstName + " " + person.lastName}
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
              value={!newPerson && person.firstName}
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
              value={!newPerson && person.lastName}
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
              value={!newPerson && person.jobTitle}
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
              value={!newPerson && person.dob}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Gender</span>
            </div>
            <select class="select select-sm select-bordered" name="gender">
              <option
                disabled
                selected={!newPerson &&
                  !["Male", "Female"].includes(person?.gender)}
              >
                Gender
              </option>
              <option selected={!newPerson && (person.gender === "Male")}>
                Male
              </option>
              <option selected={!newPerson && (person.gender === "Female")}>
                Female
              </option>
            </select>
          </label>
        </div>
        <div className="card-actions justify-end">
          <a className="btn btn-primary btn-sm" href={newPerson ? '/people' : `/people/${person.id}`}>
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
