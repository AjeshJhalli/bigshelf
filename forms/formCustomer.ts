import { FormField } from "../components/EditFormModal.tsx";
import { CustomerType } from "../types/types.ts";

export default function formCustomer(customer: CustomerType): Array<FormField> {
  return [
    {
      type: "text",
      name: "name",
      displayName: "Customer Name",
      value: customer.name,
    },
    {
      type: "text",
      name: "addressLine1",
      displayName: "Address Line 1",
      value: customer.address.line1,
    },
    {
      type: "text",
      name: "addressLine2",
      displayName: "Address Line 2",
      value: customer.address.line2,
    },
    {
      type: "text",
      name: "addressCity",
      displayName: "City",
      value: customer.address.city,
    },
    {
      type: "text",
      name: "addressCountry",
      displayName: "Country",
      value: customer.address.country,
    },
    {
      type: "text",
      name: "addressPostcode",
      displayName: "Postcode",
      value: customer.address.postcode,
    },
  ];
}