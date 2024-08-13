import { InventoryItem } from "../../types/types.ts";

export default function Inventory({ activeTenant, inventoryItems }: { activeTenant: string, inventoryItems: Array<InventoryItem> }) {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Inventory</span>
          <div className="card-actions">
            <a
              className="btn btn-sm btn-primary"
              hx-get={`/${activeTenant}/inventory/new`}
              hx-target="body"
              hx-swap="beforeend"
            >
              New
            </a>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Type</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr
                  className="hover:bg-base-200 hover:cursor-pointer"
                  hx-get={`/${activeTenant}/inventory/${item.id}/edit`}
                  hx-target="body"
                  hx-swap="beforeend"
                >
                  <td>
                    {item.name}
                  </td>
                  <td>
                    {item.type}
                  </td>
                  <td>
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
