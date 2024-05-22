import RelatedList from '../components/RelatedList.jsx';

export default function PersonTabContent({ person, selectedTab }) {

    switch (selectedTab) {
      case "email-addresses":
        return (
          <RelatedList
            items={person.emailAddresses}
            display={(emailAddress) => emailAddress.value}
            borderless
          />
        );
      case "phone-numbers":
        return (
          <RelatedList
            items={person.phoneNumbers}
            display={(phoneNumber) => phoneNumber.value}
            borderless
          />
        );
    }

}