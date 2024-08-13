import { Router } from "jsr:@oak/oak/router";
import routerCustomer from "./routerCustomer.tsx";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import r from "../utils/r.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import createCustomer from "../data/createCustomer.ts";
import getInventoryItems from "../data/getInventoryItems.ts";
import Inventory from "../pages/inventory/Inventory.tsx";
import { inventoryItemTypes } from "../valuelists/valuelists.ts";
import getInventoryItem from "../data/getInventoryItem.ts";
import formInventoryItem from "../forms/formInventoryItem.ts";
import updateCustomer from "../data/updateCustomer.ts";
import updateInventoryItem from "../data/updateInventoryItem.ts";
import { InventoryItem, InventoryItemType } from "../types/types.ts";
import createInventoryItem from "../data/createInventoryItem.ts";

const routerInventory = new Router();

routerInventory
  .get("/", async (context) => {
    const tenantId = context.state.tenantId;

    const inventoryItems = await getInventoryItems(tenantId);

    context.response.body = r(
      <Inventory inventoryItems={inventoryItems} activeTenant={tenantId} />,
      [{
        displayName: "Inventory",
        href: `/${tenantId}/inventory`,
      }],
      "inventory",
      tenantId,
    );
  })
  .get("/:itemId/edit", async (context) => {
    const tenantId = context.state.tenantId;
    const itemId = context.params.itemId;

    const item = await getInventoryItem(tenantId, itemId);

    if (!item) {
      context.response.status = 400;
      return;
    }

    const fields = formInventoryItem(item);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/inventory/${itemId}/edit`}
      />,
    );
  })
  .post("/:itemId/edit", async (context) => {
    const tenantId = context.state.tenantId;
    const itemId = context.params.itemId;

    const item = await getInventoryItem(tenantId, itemId);

    if (!item) {
      context.response.status = 400;
      return;
    }

    const data = await context.request.body.formData();

    const name = data.get("name") as string;
    const type = data.get("type") as InventoryItemType;
    const quantity = parseInt(data.get("quantity") as string);

    const newItem: InventoryItem = {
      ...item,
      name,
      type,
      quantity,
    };

    await updateInventoryItem(tenantId, newItem);

    context.response.redirect(`/${tenantId}/inventory`);
  })
  .get("/new", (context) => {
    const tenantId = context.state.tenantId;

    const item: InventoryItem = {
      id: "",
      name: "",
      type: "",
      quantity: 1,
      allocations: []
    }

    const fields = formInventoryItem(item);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/${tenantId}/inventory/new`}
      />,
    );
  })
  .post("/new", async (context) => {
    const tenantId = context.state.tenantId;

    const data = await context.request.body.formData();

    const name = data.get("name") as string;
    const type = data.get("type") as InventoryItemType;
    const quantity = parseInt(data.get("quantity") as string);

    await createInventoryItem(tenantId, {
      name,
      type,
      quantity,
      allocations: []
    });

    context.response.redirect(`/${tenantId}/inventory`);
  });

routerInventory.use("/:customerId", routerCustomer.routes());

export default routerInventory;
