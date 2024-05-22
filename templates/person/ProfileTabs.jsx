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
    >
      <ProfileRelatedDataTabs
        personId={personId}
        profileId={selectedProfile?.id}
        selectedTab='Email Addresses'
        className='col-span-2'
        items={items}
      />
    </Tabs>
  );
}