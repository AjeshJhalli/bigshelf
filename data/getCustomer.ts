import { CustomerType } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function getCustomer(tenantId: string, customerId: string) {

  const customerRecord = await kv.get<CustomerType>([
    tenantId,
    "customer",
    customerId,
  ]);

  return customerRecord.versionstamp ? customerRecord.value as CustomerType : null;
}