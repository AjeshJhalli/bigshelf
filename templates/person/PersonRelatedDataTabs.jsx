import PersonTabContent from './PersonTabContent.jsx';

export default function PersonRelatedDataTabs(
  { selectedTab, person },
) {
  function getHref(tabName) {
    return `/people/${person.id}/${tabName}`;
  }

  return (
    <section
      className="tabs tabs-lifted"
      id="person-related-data-tabs"
      role="tablist"
    >
      {[{ displayName: "Email Addresses", name: 'email-addresses', href: getHref("email-addresses") }, {
        displayName: "Phone Numbers", name: 'phone-numbers',
        href: getHref("phone-numbers"),
      }].map((tab, index) => (
        <>
          <input
            type="radio"
            role="tab"
            className="tab"
            checked={tab.name === selectedTab}
            name={`person-tabs-${person.id}`}
            aria-label={tab.displayName}
            hx-get={tab.href}
            hx-target='.person-tabs-content'
            hx-swap="innerHTML"
          />
          <div
            role="tabpanel"
            className="person-tabs-content tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {tab.name === selectedTab && <PersonTabContent person={person} selectedTab={selectedTab} />}
          </div>
        </>
      ))}
    </section>
  );
}
