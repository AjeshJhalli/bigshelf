import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { DateString, Person } from "../types/types.ts";

const kv = await Deno.openKv();

type PersonData = {
  customerId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
  dob: DateString;
  emailAddress: string;
}

export default async function createPerson(customerId: string, personData: PersonData, tenantId: string) {
  const personId = cuid();

  const person: Person = {
    ...personData,
    id: personId
  }

  await kv.set([tenantId, "person", customerId, personId], person);
  return personId;
}