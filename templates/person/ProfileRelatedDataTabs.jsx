import Tabs from '../components/Tabs.jsx';
import RelatedList from '../components/RelatedList.jsx';

export default function ProfileRelatedDataTabs({ profile, personId, selectedTab, person, className }) {

  function getHref(tabName) {
    return `/people/${personId}/profiles/${profile.key[2]}/${tabName}`;
  }

  function getRelatedList() {

    switch (selectedTab) {
      case 'Email Addresses':
        return <RelatedList items={person.value.emailAddresses} display={emailAddress => emailAddress.value} borderless />
        
      case 'Phone Numbers':
        return <RelatedList items={person.value.phoneNumbers} display={phoneNumber => phoneNumber.value} borderless />
      
      case 'Preferences':
        return <RelatedList items={profile.value.preferences} display={preference => preference.value} borderless />      
    }

  }

  return (
    <Tabs
      tabs={[
        { name: 'Email Addresses', href: getHref('email-addresses') },
        { name: 'Phone Numbers', href: getHref('phone-numbers') },
        { name: 'Preferences', href: getHref('preferences') }
      ]}
      id='profile-related-data-tabs'
      selectedTab={selectedTab}
      className={className}
    >
      {getRelatedList()}
    </Tabs>
  );
}