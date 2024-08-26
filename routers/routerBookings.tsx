import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import ButtonNew from "../components/ButtonNew.tsx";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import ModuleNav from "../layouts/authenticated-layout/ModuleNav.tsx";
import { createBooking, getBooking, getBookings, updateBooking } from "../data/booking.ts";
import EditFormModal from "../components/EditFormModal.tsx";
import formBooking from "../forms/formBooking.ts";
import { getCustomer } from "../data/customer.ts";
import ButtonEdit from "../components/ButtonEdit.tsx";
import formatDate from "../utils/formatDate.ts";

const routerBookings = new Router();

routerBookings
  .get("/", async (context) => {
    const tenantId = context.state.tenantId;

    const bookings = await getBookings(tenantId);

    const filteredBookings = [];

    for (const booking of bookings) {
      const customer = await getCustomer(tenantId, booking.customerId);
      if (customer) {
        booking.customerName = customer.name;
      }
      filteredBookings.push(booking);
    }

    context.response.body = render(
      <>
        <ModuleNav oob activeModule="bookings" />
        <Breadcrumbs
          breadcrumbs={[{
            displayName: "Bookings",
            href: "/bookings",
          }]}
        />
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
                    <th>Supplier</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      className="hover:bg-base-200 hover:cursor-pointer"
                      hx-target="#module-container"
                      hx-get={`/bookings/${booking.id}`}
                      hx-push-url="true"
                    >
                      <td>{booking.supplierId}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.type}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>,
    );
  }).get("/new", async (context) => {
    const tenantId = context.state.tenantId;

    const fields = await formBooking({
      id: "",
      type: "",
      customerId: "",
      customerName: "",
      supplierId: "",
      sectors: [],
    }, tenantId);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref="/bookings/new"
      />,
    );
  })
  .post("/new", async (context) => {
    const tenantId = context.state.tenantId;

    const data = await context.request.body.formData();

    const type = data.get("type") as string;
    const customerId = data.get("customerId") as string;

    const bookingId = await createBooking(tenantId, {
      type,
      customerId,
      supplierId: "",
      sectors: [],
    });

    context.response.headers.set("HX-Redirect", `/bookings/${bookingId}`);
  })
  .get("/:bookingId", async (context) => {
    const tenantId = context.state.tenantId;
    const bookingId = context.params.bookingId as string;

    const booking = await getBooking(tenantId, bookingId);

    if (!booking) {
      context.response.status = 400;
      return;
    }

    const customer = await getCustomer(tenantId, booking.customerId);

    if (!customer) {
      context.response.status = 400;
      return;
    }

    booking.customerName = customer.name;

    console.log(booking)

    context.response.body = render(
      <>
        <ModuleNav oob activeModule="bookings" />
        <Breadcrumbs
          breadcrumbs={[{
            displayName: "Bookings",
            href: "/bookings",
          }, {
            displayName: booking.id,
            href: `/bookings/${booking.id}`,
          }]}
        />
        <div
          id="booking-view-form"
          className="card bg-base-100 shadow-xl rounded-none h-full"
        >
          <div className="card-actions justify-end px-8 pt-8">
            <ButtonEdit href={`/bookings/${booking.id}/edit`} />
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-sm border-separate max-w-[500px]">
                <tbody>
                <tr>
                    <th>Booking ID</th>
                    <td>{booking.id}</td>
                  </tr>
                  <tr>
                    <th>Booking Type</th>
                    <td>{booking.type}</td>
                  </tr>
                  <tr>
                    <th>Customer</th>
                    <td>
                      <a
                        className="text-blue-500 hover:cursor-pointer"
                        hx-get={`/customers/${booking.customerId}`}
                        hx-target="#module-container"
                        hx-push-url="true"
                      >
                        {booking.customerName}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table className="table w-full mt-10">
              <thead>
                <tr>
                  <th>Dates</th>
                  <th>Room Type</th>
                  <th>Quantity</th>
                  <th>Names</th>
                  <th className="flex justify-end">
                    {/* <ButtonEdit href={""} /> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {booking.sectors.map((sector) => (
                  <tr
                    className="hover"
                    // hx-get={`/bookings/sectors/${sector.id}/edit`}
                    hx-target="body"
                    hx-swap="beforeend"
                  >
                    <td>{formatDate(sector.sectorDateStart)} - {formatDate(sector.sectorDateEnd)}</td>
                    <td>{sector.type}</td>
                    <td>{sector.allocations.length} / {sector.quantity}</td>
                    <td>{sector.allocations.map(allocation => allocation.personName).join(", ")}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }).get("/:bookingId/edit", async (context) => {
    const tenantId = context.state.tenantId;
    const bookingId = context.params.bookingId as string;

    const booking = await getBooking(tenantId, bookingId);

    if (!booking) {
      context.response.status = 400;
      return;
    }

    const fields = await formBooking({
      id: bookingId,
      type: booking.type,
      customerId: booking.customerId,
      customerName: booking.customerName,
      supplierId: booking.supplierId,
      sectors: booking.sectors,
    }, tenantId);

    context.response.body = render(
      <EditFormModal
        fields={fields}
        saveHref={`/bookings/${bookingId}`}
      />
    );
  })
  .post("/:bookingId", async (context) => {
    const tenantId = context.state.tenantId;
    const bookingId = context.params.bookingId as string;

    const data = await context.request.body.formData();

    const type = data.get("type") as string;
    const customerId = data.get("customerId") as string;

    await updateBooking(tenantId, {
      id: bookingId,
      type: type,
      customerId
    });

    context.response.headers.set("HX-Redirect", `/bookings/${bookingId}`);
  });

export default routerBookings;
