import ButtonNew from "../../components/ButtonNew.tsx";
import { Person } from "../../types/types.ts";
import formatDate from "../../utils/formatDate.ts";

export default function CustomerPeople(
  { people, customerId }: {
    people: Array<Person>;
    customerId: string;
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
            <ButtonNew href={`/customers/${customerId}/people/new`} />
          </th>
        </tr>
      </thead>
      <tbody>
        {people.map((person) => (
          <tr
            className="hover"
            hx-get={`/customers/${customerId}/people/${person.id}/edit`}
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
