import EditForm, { FormField } from "../../components/EditForm.tsx";

export default function CustomerEdit({ customer }) {
  const fields: Array<FormField> = [
    {
      type: "text",
      name: "name",
      displayName: "Customer Name",
      value: customer.value.name,
      required: true,
    },
    {
      type: "text",
      name: "addressLine1",
      displayName: "Address Line 1",
      value: customer.value.address?.line1,
      required: true,
    },
    {
      type: "text",
      name: "addressLine2",
      displayName: "Address Line 2",
      value: customer.value.address?.line2,
    },
    {
      type: "text",
      name: "city",
      displayName: "City",
      value: customer.value.address?.city,
      required: true,
    },
    {
      type: "text",
      name: "country",
      displayName: "Country",
      value: customer.value.address?.country,
    },
    {
      type: "text",
      name: "postcode",
      displayName: "Postcode",
      value: customer.value.address?.postcode,
      required: true,
    },
  ];

  return (
    <div class="grid grid-cols-2">
      <EditForm
        fields={fields}
        cancelHref={`/customers/${customer.key[2]}`}
        saveHref={`/customers/${customer.key[2]}/edit`}
        title="Edit Customer"
      />
    </div>
  );
}
