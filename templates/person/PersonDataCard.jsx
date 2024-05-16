import DataCard from '../components/DataCard.jsx';

export default function PersonDataCard({ person }) {

  const personFields = [
    {
      name: 'ID',
      value: person.id,
      type: 'text',
      editable: false
    },
    {
      name: 'First Name',
      value: person.name_first,
      type: 'text',
      editable: true
    },
    {
      name: 'Last Name',
      value: person.name_last,
      type: 'text',
      editable: true
    },
    {
      name: 'Gender',
      value: person.gender,
      type: 'dropdown',
      dropdownList: 'gender',
      editable: true
    },
    {
      name: 'DOB',
      value: person.dob,
      type: 'date',
      editable: true
    }
  ];

  return (
    <DataCard
      id='person-data-card'
      fields={personFields}
      editHref={`/people/${person.id}/edit`}
      cancelHref={`/people/${person.id}/cancel-edit`}
    />
  );

}