import { FieldDropdownOption } from "../components/EditFormModal.tsx";

export const inventoryItemTypes: Array<FieldDropdownOption> = [
  "Raw Materials",
  "Work In Progress",
  "Finished Goods",
  "Repair & Maintenance",
]
  .map((value) => ({ displayName: value, value }));
