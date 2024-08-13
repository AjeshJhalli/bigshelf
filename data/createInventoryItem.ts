import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { InventoryItem } from "../types/types.ts";

const kv = await Deno.openKv();

type InventoryItemData = {
  name: string;
  type: string;
  quantity: number;
  allocations: Array<{
    projectId: string;
    quantity: number;
  }>;
};

export default async function createInventoryItem(
  tenantId: string,
  itemData: InventoryItemData,
) {
  const itemId = cuid();

  const item: InventoryItem = {
    ...itemData,
    id: itemId,
  };

  await kv.set([tenantId, "inventoryItem", itemId], item);
  return itemId;
}
