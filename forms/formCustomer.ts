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
  ];
}
