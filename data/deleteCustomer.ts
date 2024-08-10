import { CustomerType } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function deleteCustomer(
  tenantId: string,
  customerId: string,
) {
  const customer = await kv.get<CustomerType>([
    tenantId,
    "customer",
    customerId,
  ]);
  if (customer.value === null) {
    return;
  }

  const deleteCustomerTransaction = kv.atomic()
    .check(customer)
    .delete([tenantId, "customer", customerId]);

  for await (
    const person of kv.list({
      prefix: [tenantId, "person", customerId],
    })
  ) {
    console.log(person);
    deleteCustomerTransaction.delete(person.key);
  }

  await deleteCustomerTransaction.commit();
}
