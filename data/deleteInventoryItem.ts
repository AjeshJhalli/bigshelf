const kv = await Deno.openKv();

export default async function deleteInventoryItem(tenantId: string, itemId: string) {
  await kv.delete([tenantId, "inventoryItem", itemId]);
}