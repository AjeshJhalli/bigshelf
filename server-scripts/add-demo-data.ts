import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import { faker, it } from "https://esm.sh/@faker-js/faker";
import { CustomerType, DateString, Person } from "../types/types.ts";
import createCustomer from "../data/createCustomer.ts";
import createPerson from "../data/createPerson.ts";
import encodeDate from "../utils/encodeDate.ts";
import decodeDate from "../utils/decodeDate.ts";
import shuffle from "https://deno.land/x/shuffle@v1.0.1/mod.ts";
import { createBooking, Sector, SectorAllocation } from "../data/booking.ts";

const tenantId = "clz0bom4i0000x1t4m7lbcjeb";

const kv = await Deno.openKv();

const items = await Array.fromAsync(kv.list({prefix: [tenantId]}));

for (const item of items) {
  await kv.delete(item.key);
}

for (let i = 0; i < 100; i++) {
  const customerId = await createCustomer({
    name: faker.company.name(),
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.location.city(),
      city: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
    },
  }, tenantId);

  const personCount = Math.round(Math.random() * 10) + 1;
  const bookingCount = Math.round(Math.random() * 5) + 1;

  const people: Array<SectorAllocation> = [];

  for (let j = 0; j < personCount; j++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const person = {
      customerId,
      firstName,
      lastName,
      jobTitle: faker.person.jobTitle(),
      gender: Math.random() < 0.5 ? "Male" : "Female",
      emailAddress: faker.internet.email(),
      dob: faker.date.birthdate().toISOString().split("T")[0] as DateString,
    };

    const personId = await createPerson(customerId, person, tenantId);

    people.push({ personId, personName: `${firstName} ${lastName}` });
  }

  for (let j = 0; j < bookingCount; j++) {

    const sectorCount = faker.number.int({min: 2, max: 10});

    const sectors: Array<Sector> = [];

    for (let s = 0; s < sectorCount; s++) {
      const date1 = faker.date.future();
      const date2String = faker.date.future({ refDate: date1 }).toISOString()
        .split("T")[0] as DateString;
      const date1String = date1.toISOString().split("T")[0] as DateString;
      const quantity = faker.number.int({ min: 1, max: 5 });
      const allocatedCount = faker.number.int({ min: 1, max: quantity });
      const allocations: Array<SectorAllocation> = [];
      const peopleCopy = shuffle(people);
      for (let k = 0; k < allocatedCount; k++) {
        allocations.push(peopleCopy[k]);
      }
      sectors.push({
        id: cuid(),
        sectorDateStart: date1String,
        sectorDateEnd: date2String,
        allocations,
        quantity: faker.number.int({ min: 1, max: 5 }),
        type: faker.database.type(),
      });
    }

    await createBooking(tenantId, {
      customerId,
      sectors,
      supplierId: "",
      type: "Hotel",
    });
  }
}
