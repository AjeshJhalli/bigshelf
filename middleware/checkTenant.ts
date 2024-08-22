import { User } from "../types/types.ts";

export default async function checkTenant(context, next) {
  const user = context.state.user as User;
  const tenantId = user.activeTenant;

  if (!tenantId) {
    context.response.status = 400;
    context.response.body = "Unauthorized";
    return;
  }

  context.state.tenantId = user.activeTenant;

  await next();
}
