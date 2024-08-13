import { InventoryItem } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function getInventoryItems(tenantId: string) {
  const items = await Array.fromAsync(
    kv.list<InventoryItem>({ prefix: [tenantId, "inventoryItem"] }),
  );
  return items.map((record) => record.value);
}
