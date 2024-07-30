import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { CustomerValue } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function createCustomer(customerData: CustomerValue, tenantId: string) {
  const customerId = cuid();
  await kv.set([tenantId, "customer", customerId], customerData);
  return customerId;
}