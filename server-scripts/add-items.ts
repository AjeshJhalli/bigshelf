import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { InventoryItem } from "../types/types.ts";

const kv = await Deno.openKv();

const items: Array<InventoryItem> = [
  {
    id: cuid(),
    name: "Obsidian",
    type: "Raw Materials",
    quantity: 10,
    allocations: [],
  },
  {
    id: cuid(),
    name: "Flint & Stone",
    type: "Work In Progress",
    quantity: 3,
    allocations: [],
  },
  {
    id: cuid(),
    name: "Iron Axe",
    type: "Work In Progress",
    quantity: 2,
    allocations: [],
  },
];

for (const item of items) {
  await kv.set(["clz0bom4i0000x1t4m7lbcjeb", "inventoryItem", item.id], item);
}
