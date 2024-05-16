import Tabs from '../components/Tabs.jsx';
import DataCard from '../components/DataCard.jsx';
import RelatedList from '../components/RelatedList.jsx';
import ProfileRelatedDataTabs from './ProfileRelatedDataTabs.jsx';

export default function ProfileTabs({ personId, profiles, selectedProfile, items }) {
  return (
    <Tabs
      id='profile-tabs'
      tabs={profiles.map(profile => 
        ({
          name: profile?.name || '',
          href: `/people/${personId}/profiles/${profile?.id}`
        })
      )}
      selectedTab={selectedProfile?.name}
      className='col-span-2 row-span-2'
      listClassName='h-full'
    >
      <div className='grid grid-cols-3 h-full gap-x-3'>
        <DataCard
          fields={[
            {
              name: 'Profile Name',
              value: selectedProfile?.name,
              editable: true
            },
            {
              name: 'FF5',
              value: selectedProfile?.ff5,
              editable: true
            },
          ]}
          editHref={`/people/${personId}/profiles/${selectedProfile?.id}/edit`}
          cancelHref={`/people/${personId}/profiles/${selectedProfile?.id}/cancel-edit`}
        />
        <ProfileRelatedDataTabs
          personId={personId}
          profileId={selectedProfile?.id}
          selectedTab='Email Addresses'
          className='col-span-2'
          items={items}
        />
      </div>
    </Tabs>
  );
}