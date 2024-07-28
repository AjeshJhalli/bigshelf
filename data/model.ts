import { DateString } from "../types/types.ts";

export type User = {
  oid: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
  dob: DateString;
  activeTenant: string;
  tenants: Array<string>
};

export type Tenant = {
  name: string;
  description: string;
};