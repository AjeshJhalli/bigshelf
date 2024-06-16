import { TypePerson } from "../../types/types.ts";
import PersonDataCard from "./PersonDataCard.tsx";

export default function Person({ person }: { person: TypePerson }) {

  return (
    <>
      <h2 className="text-sm breadcrumbs">
        <ul>
          <li>
            <a href='/people'>People</a>
          </li>
          <li>
            <a href={`/people/${person.id}`}>{person.firstName + ' ' + person.lastName}</a>
          </li>
        </ul>
      </h2>
      <div className='grid grid-cols-2 grid-rows-2 items-start gap-3 border-gray-300 p-3'>
        <PersonDataCard person={person} />
      </div>
    </>
  );
}