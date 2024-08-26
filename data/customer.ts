import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { Address, CustomerType, Person } from "../types/types.ts";

const kv = await Deno.openKv();

type CustomerData = {
  name: string;
  address: Address;
}

export async function createCustomer(customerData: CustomerData, tenantId: string) {
  const customerId = cuid();

  const customer: CustomerType = {
    ...customerData,
    id: customerId
  }

  await kv.set([tenantId, "customer", customerId], customer);
  return customerId;
}


export async function deleteCustomer(
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
    deleteCustomerTransaction.delete(person.key);
  }

  await deleteCustomerTransaction.commit();
}

export async function getCustomer(tenantId: string, customerId: string) {

  const customerRecord = await kv.get<CustomerType>([
    tenantId,
    "customer",
    customerId,
  ]);

  return customerRecord.versionstamp ? customerRecord.value as CustomerType : null;
}

export async function getCustomerPeople(tenantId: string, customerId: string) {
  const peopleRecords = await Array.fromAsync(kv.list<Person>({ prefix: [tenantId, "person", customerId] }));
  return peopleRecords.map(record => record.value);
}

export async function updateCustomer(tenantId: string, customerId: string, customer: CustomerType) {
  await kv.set([tenantId, "customer", customerId], customer);
}