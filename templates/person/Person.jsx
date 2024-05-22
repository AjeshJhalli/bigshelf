import PersonDataCard from "./PersonDataCard.jsx";
import PersonRelatedDataTabs from "./PersonRelatedDataTabs.jsx";
import ProfileTabs from './ProfileTabs.jsx';

export default function Person({ person }) {


  const profileEmailAddresses = person.emailAddresses
    .filter(({ id }) => person.profiles[0].linkedEmailAddresses.includes(id));

  return (
    <>
      <h2 className="text-sm breadcrumbs">
        <ul>
          <li>
            <a href='/people'>People</a>
          </li>
          <li>
            <a href={`/people/${person.id}`}>{person.name_first + ' ' + person.name_last}</a>
          </li>
        </ul>
        
        
      </h2>
      <div className='grid grid-cols-2 grid-rows-2 items-start gap-3 border-gray-300 p-3'>
        <PersonDataCard person={person} />
        {/* {
          (person.profiles && person.profiles.length > 0) ?      
          <ProfileTabs
            person={person}
            profiles={person.profiles}
            selectedProfile={person.profiles[0]}
            personId={person.id}
            items={profileEmailAddresses}
          />
          :
          'This person has no profiles'
        } */}
      </div>
    </>
  );
}