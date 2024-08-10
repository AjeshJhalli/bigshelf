import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { Address, CustomerType } from "../types/types.ts";

const kv = await Deno.openKv();

type CustomerData = {
  name: string;
  address: Address;
}

export default async function createCustomer(customerData: CustomerData, tenantId: string) {
  const customerId = cuid();

  const customer: CustomerType = {
    ...customerData,
    id: customerId
  }

  await kv.set([tenantId, "customer", customerId], customer);
  return customerId;
}