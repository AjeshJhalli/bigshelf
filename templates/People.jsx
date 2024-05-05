export default function People({ people }) {
  return (
    <>
      <h1 className="font-semibold text-2xl pb-4">People</h1>
      <ul>
        {
          people.map(person => 
            <li className="hover:bg-gray-200">
              <a href={`/people/${person.key[1]}`}>
                {person.value.name} (DOB {person.value.dob})
              </a>
            </li>
          )
        }
      </ul>
    </>
  );
}