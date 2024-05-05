import Tabs from '../components/Tabs.jsx';
import RelatedList from '../components/RelatedList.jsx';

export default function PersonRelatedDataTabs({ selectedTab, person, className }) {

  function getHref(tabName) {
    return `/people/${person.key[1]}/${tabName}`;
  }

  function getRelatedList() {

    switch (selectedTab) {
      case 'Email Addresses':
        return <RelatedList items={person.value.emailAddresses} display={emailAddress => emailAddress.value} borderless />
      case 'Phone Numbers':
        return <RelatedList items={person.value.phoneNumbers} display={phoneNumber => phoneNumber.value} borderless />
    }

  }

  return (
    <Tabs
      tabs={[
        { name: 'Email Addresses', href: getHref('email-addresses') },
        { name: 'Phone Numbers', href: getHref('phone-numbers') }
      ]}
      id='profile-related-data-tabs'
      selectedTab={selectedTab}
      className={className}
    >
      {getRelatedList()}
    </Tabs>
  );
}