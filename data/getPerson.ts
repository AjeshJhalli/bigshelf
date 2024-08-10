import { Person } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function getPerson(
  tenantId: string,
  customerId: string,
  personId: string,
) {
  const person = await kv.get<Person>([
    tenantId,
    "person",
    customerId,
    personId,
  ]);

  return person.versionstamp ? person.value : null;
}
