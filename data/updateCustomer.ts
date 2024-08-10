import { CustomerType } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function updateCustomer(tenantId: string, customerId: string, customer: CustomerType) {
  await kv.set([tenantId, "customer", customerId], customer);
}