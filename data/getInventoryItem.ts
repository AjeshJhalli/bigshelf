import { InventoryItem } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function getInventoryItem(
  tenantId: string,
  itemId: string
) {
  const item = await kv.get<InventoryItem>([
    tenantId,
    "inventoryItem",
    itemId
  ]);

  return item.versionstamp ? item.value : null;
}
