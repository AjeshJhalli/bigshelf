import { PersonRecord } from "../../types/types.ts";
import formatDate from "../../utils/formatDate.ts";

export default function CustomerPeople(
  { people, customerId, activeTenant }: {
    people: Array<PersonRecord>;
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
      <tbody className="">
        {people.map((person) => (
          <tr
            className="hover"
            hx-get={`/${activeTenant}/customers/${customerId}/people/${person.key[3]}/edit`}
            hx-target="body"
            hx-swap="beforeend"
          >
            <td>{`${person.value.firstName} ${person.value.lastName}`}</td>
            <td>{formatDate(person.value.dob)}</td>
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
