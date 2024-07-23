import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import tenantName from "./tenantName.ts";

const kv = await Deno.openKv();

export default async function createUser(
  oid: string,
  firstName: string,
  lastName: string,
  jobTitle: string,
  dob: string,
  gender: string,
  tenantId?: string,
) {
  
  const newTenantId = cuid();
  await kv.set(["tenant", newTenantId], {
    name: tenantName(firstName),
    description:
      "This tenant was automatically created during a user sign up.",
  });

  await kv.set(["user", oid], {
    firstName,
    lastName,
    dob,
    jobTitle,
    gender,
    activeTenant: tenantId || newTenantId,
    tenants: [tenantId || newTenantId],
  });
}
