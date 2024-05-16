import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load();
const databaseUrl = env["DATABASE_URL"];
const pool = new Pool(databaseUrl, 3, true);
const connection = await pool.connect();

try {
  // Create the table
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS person (
      z_pk_person SERIAL PRIMARY KEY,
      person_name_first TEXT,
      person_name_last TEXT,
      person_gender TEXT,
      person_dob DATE,
      x_creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      x_modification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
} finally {
  // Release the connection back into the pool
  connection.release();
}