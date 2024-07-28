const kv = await Deno.openKv();

const records = await kv.list({ prefix: [] });

for await (const record of records) {
  console.log(record);
}