import { Address } from "../types/types.ts";

export default function addressLateral(address: Address): string {
  return [
    address.line1,
    address.line2,
    address.city,
    address.country,
    address.postcode,
  ]
    .filter((line) => line)
    .join(", ");
}
