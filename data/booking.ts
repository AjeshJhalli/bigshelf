import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { DateString } from "../types/types.ts";

const kv = await Deno.openKv();

export type Booking = {
  id: string;
  type: string;
  supplierId: string;
  customerId: string;
  customerName: string;
  sectors: Array<Sector>;
};

export type BookingData = {
  type: string;
  supplierId: string;
  customerId: string;
  sectors: Array<Sector>;
};

export type Sector = {
  id: string;
  type: string;
  quantity: number;
  sectorDateStart: DateString;
  sectorDateEnd: DateString;
  allocations: Array<SectorAllocation>;
};

export type SectorAllocation = {
  personId: string;
  personName: string;
};

export async function createBooking(
  tenantId: string,
  booking: BookingData,
) {
  const bookingId = cuid();
  await kv.set([tenantId, "booking", bookingId], { ...booking, id: bookingId });
  return bookingId;
}

export async function getBooking(tenantId: string, bookingId: string): Promise<Booking | null> {
  const booking = await kv.get<Booking>([tenantId, "booking", bookingId]);
  if (!booking.versionstamp) return null;
  return booking.value;
}

export async function getBookings(tenantId: string): Promise<Booking[]> {
  return (await Array.fromAsync(
    kv.list<Booking>({ prefix: [tenantId, "booking"] }),
  )).map((booking) => booking.value);
}

export async function updateBooking(tenantId: string, booking: any) {
  const oldBooking = await kv.get([tenantId, "booking", booking.id]);
  const newBooking = { ...(oldBooking.value), ...booking };
  console.log(newBooking)
  await kv.set([tenantId, "booking", booking.id], newBooking);
}
