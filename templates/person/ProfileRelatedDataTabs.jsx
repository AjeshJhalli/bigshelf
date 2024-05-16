import Tabs from '../components/Tabs.jsx';
import RelatedList from '../components/RelatedList.jsx';

export default function ProfileRelatedDataTabs({ profileId, selectedTab, personId, className, items }) {

  function getHref(tabName) {
    return `/people/${personId}/profiles/${profileId}/${tabName}`;
  }

  function getRelatedList() {

    switch (selectedTab) {
      case 'Email Addresses':
        return <RelatedList items={items} display={emailAddress => emailAddress.value} borderless />
        
      case 'Phone Numbers':
        return <RelatedList items={items} display={phoneNumber => phoneNumber.value} borderless />
      
      case 'Preferences':
        return <RelatedList items={items} display={preference => preference.value} borderless />      
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