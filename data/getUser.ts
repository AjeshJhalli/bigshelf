import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { User } from "./model.ts";
import tenantName from "./tenantName.ts";

const kv = await Deno.openKv();

export default async function getUser(oid: string): Promise<User | null> {
  const userRecord = await kv.get<User>(["user", oid]);

  if (!userRecord.versionstamp) {
    return null;
  }

  const user = userRecord.value as User;

  if (!Array.isArray(user.tenants) || user.tenants.length === 0) {
    const newTenantId = cuid();
    await kv.set(["tenant", newTenantId], {
      name: tenantName(user.firstName),
      description:
        "This tenant was automatically created during a user sign up.",
    });

    await kv.set(["user", oid], {
      ...user,
      activeTenant: newTenantId,
      tenants: [newTenantId],
    });

    const updatedUserRecord = await kv.get<User>(["user", oid]);

    if (updatedUserRecord.versionstamp) {
      return updatedUserRecord.value;
    } else {
      return null;
    }
  }

  return { ...user, oid };
}
