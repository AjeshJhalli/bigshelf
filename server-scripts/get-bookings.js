const kv = await Deno.openKv();

const list = await kv.list({ prefix: ["bigshelf_test", "booking"]});

console.log(await list.next());