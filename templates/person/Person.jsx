import DataCard from '../components/DataCard.jsx';
import RelatedList from '../components/RelatedList.jsx';
import PersonRelatedDataTabs from "./PersonRelatedDataTabs.jsx";
import ProfileTabs from './ProfileTabs.jsx';

export default function Person({ person }) {

  const personFields = [
    {
      name: 'ID',
      value: person.key[1]
    },
    {
      name: 'Name',
      value: person.value.name
    },
    {
      name: 'Gender',
      value: person.value.gender
    },
    {
      name: 'DOB',
      value: person.value.dob
    }
  ];

  return (
    <>
      <h2 className="font-semibold text-blue-500 px-3 flex-none">
        <a href='/people'>People {'>'}</a> {person.value.name}
      </h2>
      <div className='grid grid-cols-2 grid-rows-3 h-full gap-3 border-gray-300 p-3'>
        <DataCard fields={personFields} />
        <PersonRelatedDataTabs person={person} selectedTab='Email Addresses' />
        <ProfileTabs
          person={person}
          profiles={person.value.profiles}
          selectedProfile={person.value.profiles[0]}
          personId={person.key[1]}
        />
      </div>
    </>
  );
}