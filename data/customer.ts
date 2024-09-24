import { Address, CustomerType, Person } from "../types/types.ts";
import { dbPool } from "../database.ts";

const kv = await Deno.openKv();

type CustomerData = {
  name: string;
  address: Address;
}

export async function createCustomer(customerData: CustomerData, tenantId: string) {
  using client = await dbPool.connect();
  await client.queryArray(`INSERT INTO customer (tenant_id, name) VALUES ('${tenantId}', '${customerData.name}')`);
  const resultId = await client.queryArray`SELECT LASTVAL()`;
  return resultId.rows[0];
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

  using client = await dbPool.connect();
  const result = await client.queryObject(`SELECT * FROM customer WHERE tenant_id = '${tenantId}' AND id = ${parseInt(customerId)}`);

  const customerRecord: CustomerType = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    address: {
      line1: "",
      line2: "",
      city: "",
      country: "",
      postcode: ""
    }
  }
  
  return customerRecord;
}

export async function getCustomers(tenantId: string) {

  using client = await dbPool.connect();
  const result = await client.queryObject(`SELECT * FROM customer WHERE tenant_id = '${tenantId}'`);

  const customers: Array<CustomerType> = result.rows.map(record => ({
    id: record.id,
    name: record.name,
    address: {
      line1: "",
      line2: "",
      city: "",
      country: "",
      postcode: ""
    }
  }));

  return customers;

}

export async function getCustomerPeople(tenantId: string, customerId: string) {
  const peopleRecords = await Array.fromAsync(kv.list<Person>({ prefix: [tenantId, "person", customerId] }));
  return peopleRecords.map(record => record.value);
}

export async function updateCustomer(tenantId: string, customerId: string, customer: CustomerType) {
  await kv.set([tenantId, "customer", customerId], customer);
}