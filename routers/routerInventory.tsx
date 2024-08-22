import getInventoryItems from "../data/getInventoryItems.ts";
import getInventoryItem from "../data/getInventoryItem.ts";
import formInventoryItem from "../forms/formInventoryItem.ts";
import updateInventoryItem from "../data/updateInventoryItem.ts";
import { InventoryItemType } from "../types/types.ts";
import createInventoryItem from "../data/createInventoryItem.ts";
import routerModuleBase from "./routerModuleBase.tsx";
import deleteInventoryItem from "../data/deleteInventoryItem.ts";

const routerInventory = routerModuleBase({
  name: "inventory",
  displayName: "Inventory",
  getAll: getInventoryItems,
  getOne: getInventoryItem,
  update: updateInventoryItem,
  create: createInventoryItem,
  delete: deleteInventoryItem,
  recordColumns: [
    { name: "name", displayName: "Item Name" },
    { name: "type", displayName: "Type" },
    { name: "quantity", displayName: "Quantity" },
  ],
  form: formInventoryItem,
  validateForm: validateFormInventoryItem,
});

function validateFormInventoryItem(data: FormData) {
  const name = data.get("name") as string;
  const type = data.get("type") as InventoryItemType;
  const quantity = parseInt(data.get("quantity") as string);

  const itemTypes = [
    "Raw Materials",
    "Work In Progress",
    "Finished Goods",
    "Repair & Maintenance",
    "",
  ];

  if (
    name.length === 0 || quantity < 0 || type.length === 0 ||
    !itemTypes.includes(type)
  ) {
    return null;
  }

  return { name, type, quantity };
}

export default routerInventory;
