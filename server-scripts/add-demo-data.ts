import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";

const kv = await Deno.openKv();

const records = await kv.list({ prefix: [] });

let record = await records.next();
while (record) {
  if (!record.value) {
    break;
  }

  await kv.delete(record.value?.key);

  record = await records.next();
}

const customer = {
  name: "Prime Hydration UK Ltd",
  address: {
    line1: "60 Gracechurch Street",
    line2: "",
    city: "London",
    country: "United Kingdom",
    postcode: "EC3V 0HR",
  },
};

const person = {
  firstName: "Logan",
  lastName: "Paul",
  jobTitle: "Prime Person",
  gender: "Male",
  dob: "1992-10-16",
  email: "ajeshjhalli@gmail.com",
};

const person2 = {
  firstName: "Florence",
  lastName: "Pugh",
  jobTitle: "Actress",
  gender: "Female",
  dob: "1998-07-14",
  email: "ajeshjhalli@gmail.com",
};

const customerId = cuid();

// Tenant ID, 'person', customer ID, person ID
await kv.set(["bigshelf_test", "person", customerId, cuid()], person);
await kv.set(["bigshelf_test", "person", customerId, cuid()], person2);

// Tenant ID, 'person', company/customer ID, person ID
await kv.set(["bigshelf_test", "customer", customerId], customer);
