import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { PersonValue } from "../types/types.ts";

const kv = await Deno.openKv();

export default async function createPerson(customerId: string, personData: PersonValue) {
  const personId = cuid();
  await kv.set(["bigshelf_test", "person", customerId, personId], personData);
  return personId;
}