import Tabs from '../components/Tabs.jsx';
import DataCard from '../components/DataCard.jsx';
import RelatedList from '../components/RelatedList.jsx';
import ProfileRelatedDataTabs from './ProfileRelatedDataTabs.jsx';

export default function ProfileTabs({ person, profiles, selectedProfile, personId }) {
  return (
    <Tabs
      id='profile-tabs'
      tabs={profiles.map(profile => 
        ({
          name: profile.value.name,
          href: `/people/${personId}/profiles/${profile.key[2]}`
        })
      )}
      selectedTab={selectedProfile.value.name}
      className='col-span-2 row-span-2'
      listClassName='h-full'
    >
      <div className='grid grid-cols-3 h-full gap-x-3'>
        <DataCard fields={[
          {
            name: 'Profile Name',
            value: selectedProfile.value.name,
          },
          {
            name: 'FF5',
            value: selectedProfile.value.ff5,
          },
        ]} />
        <ProfileRelatedDataTabs
          person={person}
          profile={selectedProfile}
          personId={personId}
          selectedTab='Email Addresses'
          className='col-span-2'
        />
      </div>
    </Tabs>
  );
}