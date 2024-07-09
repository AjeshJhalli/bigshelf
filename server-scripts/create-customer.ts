const kv = await Deno.openKv();

const customer = {
  name: "Prime Hydration UK Ltd",
  address: {
    line1: "60 Gracechurch Street",
    line2: "",
    city: "London",
    country: "United Kingdom",
    postcode: "EC3V 0HR"
  }
};

// Tenant ID, 'person', company/customer ID, person ID
await kv.set(['bigshelf_test','customer', 1], customer);