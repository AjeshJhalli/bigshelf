import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const POOL_CONNECTIONS = 5;

export const dbPool = new Pool(
  {
    database: "postgres",
    hostname: "aws-0-eu-west-2.pooler.supabase.com",
    port: 6543,
    user: "postgres.wjucgknzgympnnywamjy",
    password: Deno.env.get("PGPASSWORD")
  },
  POOL_CONNECTIONS,
);
