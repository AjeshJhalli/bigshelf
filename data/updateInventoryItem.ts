import { InventoryItem } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function updateInventoryItem(tenantId: string, item: InventoryItem) {
  await kv.set([tenantId, "inventoryItem", item.id], item);
}