import PersonEdit from "./People/PersonEdit.tsx";

export function CustomerPeopleTab({ people }) {
  const defaultEmail = (emails: Array<any>) => {
    return emails.find((email: any) => email.default).value || "";
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Job Title</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {people.map((person) => (
          <tr
            className="hover"
            hx-get={`/customers/${person.key[2]}/people/${person.key[3]}/edit`} hx-target="body" hx-swap="beforeend"
          >
            <td>{`${person.value.firstName} ${person.value.lastName}`}</td>
            <td>{person.value.dob}</td>
            <td>{person.value.gender}</td>
            <td>{person.value.jobTitle}</td>
            <td>{defaultEmail(person.value.emails)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CustomerBookingsTab({ bookings }) {
  return <p>Bookings module not yet implemented</p>;
}
