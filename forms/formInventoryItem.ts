import { FormField } from "../components/EditFormModal.tsx";
import { InventoryItem } from "../types/types.ts";
import { inventoryItemTypes } from "../valuelists/valuelists.ts";

export default function formInventoryItem(
  item: InventoryItem,
): Array<FormField> {
  return [
    {
      type: "text",
      name: "name",
      displayName: "Name",
      value: item.name,
    },
    {
      type: "dropdown",
      options: inventoryItemTypes,
      name: "type",
      displayName: "Type",
      value: item.type,
    },
    {
      type: "text",
      name: "quantity",
      displayName: "Quantity",
      value: item.quantity.toString(),
    },
  ];
}
