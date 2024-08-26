import { FormField } from "../components/EditFormModal.tsx";
import { Booking } from "../data/booking.ts";
import { CustomerType } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function formBooking(
  booking: Booking,
  tenantId: string,
): Promise<FormField[]> {
  return [
    {
      type: "dropdown",
      name: "type",
      displayName: "Type",
      value: booking.customerId,
      options: [
        {
          displayName: "Hotel",
          value: "Hotel",
        },
      ],
    },
    {
      type: "dropdown",
      name: "customerId",
      displayName: "Customer",
      value: booking.customerId,
      options: await getCustomerDropdownOptions(tenantId),
    },
  ];
}

async function getCustomerDropdownOptions(tenantId: string) {
  const customers = await Array.fromAsync(
    kv.list<CustomerType>({ prefix: [tenantId, "customer"] }),
  );
  return customers.map((customer) => ({
    value: customer.value.id,
    displayName: customer.value.name,
  }));
}
