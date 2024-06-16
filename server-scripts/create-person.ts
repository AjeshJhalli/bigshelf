const kv = await Deno.openKv();

const person = {
  firstName: "Ajesh",
  lastName: "Jhalli",
  jobTitle: "Software Engineer",
  gender: "Male",
  dob: "2002-11-12",
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
      default: true
    }
  ]
};

// Tenant ID, 'person', company/customer ID, person ID
await kv.set(['bigshelf_test','person', 1, 1], person);