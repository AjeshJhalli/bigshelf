import { User } from "../types/types.ts";

export default async function checkTenant(context, next) {
  const tenantId = context.params.tenantId as string;
  const user = context.state.user as User;

  console.log(tenantId);
  console.log(user);
  console.log(context.params)

  if (tenantId !== user.activeTenant) {
    context.response.status = 401;
    context.response.body = "Unauthorized";
    return;
  }

  context.state.tenantId = context.params.tenantId;

  await next();
}
