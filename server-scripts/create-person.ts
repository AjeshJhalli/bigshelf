const kv = await Deno.openKv();

const person = {
  firstName: "Logan",
  lastName: "Paul",
  jobTitle: "Prime Person",
  gender: "Male",
  dob: "1992-10-16",
  emails: [
    {
      default: true,
      value: "ajeshjhalli@gmail.com",
    },
  ],
  passports: [
    {
      number: "A1234567",
      type: "P",
      issuingAuthority: "IPS",
      issueDate: "2024-01-20",
      countryCode: "GBR",
      sex: "Male",
      dob: "2002-11-12",
      name: "Ajesh Jhalli",
      default: true,
    },
  ],
};

const person2 = {
  firstName: "Florence",
  lastName: "Pugh",
  jobTitle: "Actress",
  gender: "Female",
  dob: "1998-07-14",
  emails: [
    {
      default: true,
      value: "ajeshjhalli@gmail.com",
    },
  ],
  passports: [
    {
      number: "A1234567",
      type: "P",
      issuingAuthority: "IPS",
      issueDate: "2024-01-20",
      countryCode: "GBR",
      sex: "Male",
      dob: "2002-11-12",
      name: "Ajesh Jhalli",
      default: true,
    },
  ],
};

// Tenant ID, 'person', customer ID, person ID
await kv.set(["bigshelf_test", "person", 1, 1], person);
await kv.set(["bigshelf_test", "person", 1, 2], person2);
