import { Person } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function getCustomerPeople(tenantId: string, customerId: string) {
  const peopleRecords = await Array.fromAsync(kv.list<Person>({ prefix: [tenantId, "person", customerId] }));
  return peopleRecords.map(record => record.value);
}