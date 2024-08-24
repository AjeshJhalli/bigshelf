import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import r from "../utils/r.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import formInventoryItem from "../forms/formInventoryItem.ts";
import ViewForm from "../components/ViewForm.tsx";
import ButtonNew from "../components/ButtonNew.tsx";

const routerBookings = new Router();

routerBookings
  .get("/", async (context) => {

    const records = [];

    const bookingColumns = [
      "Supplier",
      "Type",
      "Date"
    ]

    context.response.body = r(
      <div className="card bg-base-100 shadow-lg flex flex-grow rounded-none">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <span>Bookings</span>
          <div className="card-actions">
            <ButtonNew href="/bookings/new" />
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {bookingColumns.map((column) => <th>{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  className="hover:bg-base-200 hover:cursor-pointer"
                  hx-get={record.editHref}
                  hx-target="body"
                  hx-swap="beforeend"
                >
                  {record.fields.map((field) => (
                    <td>
                      {field}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ,
      [{
        displayName: "Bookings",
        href: "/bookings",
      }],
      "bookings",
    );
  });

export default routerBookings;