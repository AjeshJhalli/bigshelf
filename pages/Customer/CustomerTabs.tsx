import { PersonRecord } from "../../types/types.ts";

export function CustomerPeopleTab({ people, customerId }: { people: Array<PersonRecord>, customerId: string }) {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Job Title</th>
          <th>Email</th>
          <th className="flex justify-end">
            <button
              className="btn btn-sm btn-primary"
              hx-get={`/customers/${customerId}/people/new`}
              hx-target="body"
              hx-swap="beforeend"
            >
              New
            </button>
          </th>
        </tr>
      </thead>
      <tbody className="">
        {people.map((person) => (
          <tr
            className="hover"
            hx-get={`/customers/${customerId}/people/${person.key[3]}/edit`}
            hx-target="body"
            hx-swap="beforeend"
          >
            <td>{`${person.value.firstName} ${person.value.lastName}`}</td>
            <td>{person.value.dob}</td>
            <td>{person.value.gender}</td>
            <td>{person.value.jobTitle}</td>
            <td>{person.value.emailAddress}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CustomerBookingsTab() {
  return <p>Bookings module not yet implemented</p>;
}
