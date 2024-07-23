export default function tenantName(firstName: string) {
  return firstName.slice(-1).toLowerCase() === "s"
    ? `${firstName}' Tenant`
    : `${firstName}'s Tenant`;
}
