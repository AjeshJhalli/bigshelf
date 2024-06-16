const kv = await Deno.openKv();

const customer = {
  name: "PRIME HYDRATION UK LTD",
  address: "6TH FLOOR, 60 GRACECHURCH STREET, UNITED KINGDOM, LONDON, EC3V 0HR copy copied"
};

// Tenant ID, 'person', company/customer ID, person ID
await kv.set(['bigshelf_test','customer', 1], customer);