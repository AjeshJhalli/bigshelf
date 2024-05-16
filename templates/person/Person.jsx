import PersonDataCard from "./PersonDataCard.jsx";
import PersonRelatedDataTabs from "./PersonRelatedDataTabs.jsx";
import ProfileTabs from './ProfileTabs.jsx';

export default function Person({ person }) {


  const profileEmailAddresses = person.emailAddresses
    .filter(({ id }) => person.profiles[0].linkedEmailAddresses.includes(id));

  return (
    <>
      <h2 className="font-semibold text-blue-500 px-3 flex-none">
        <a href='/people'>People {'>'}</a> {person.name_first + ' ' + person.name_last}
      </h2>
      <div className='grid grid-cols-2 grid-rows-3 h-full gap-3 border-gray-300 p-3'>
        <PersonDataCard person={person} />
        <PersonRelatedDataTabs person={person} selectedTab='Email Addresses' />
        {
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
        }
      </div>
    </>
  );
}