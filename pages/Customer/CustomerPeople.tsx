import { Person } from "../../types/types.ts";
import formatDate from "../../utils/formatDate.ts";

export default function CustomerPeople(
  { people, customerId, activeTenant }: {
    people: Array<Person>;
    customerId: string;
    activeTenant: string;
  },
) {
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
              hx-get={`/${activeTenant}/customers/${customerId}/people/new`}
              hx-target="body"
              hx-swap="beforeend"
            >
              New
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {people.map((person) => (
          <tr
            className="hover"
            hx-get={`/${activeTenant}/customers/${customerId}/people/${person.id}/edit`}
            hx-target="body"
            hx-swap="beforeend"
          >
            <td>{`${person.firstName} ${person.lastName}`}</td>
            <td>{formatDate(person.dob)}</td>
            <td>{person.gender}</td>
            <td>{person.jobTitle}</td>
            <td>{person.emailAddress}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
