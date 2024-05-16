const db = await Deno.openKv();

const person = {
  name: "Jennie Kim",
  dob: "1998-05-10",
  gender: "Female",
  nextProfileId: 5,
  companies: [
    {
      customer_id: 1,
      company_name: "YG Entertainment",
    },
    {
      customer_id: 3,
      company_name: "Xo Xo",
    },
  ],
  emailAddresses: [
    {
      id: 1,
      default: true,
      value: "jenniekim@gmail.com",
      linkedProfiles: [1, 2],
    },
  ],
  phoneNumbers: [
    {
      id: 1,
      default: true,
      value: "+1 3343 458943",
      linkedProfiles: [2, 3, 4]
    },
  ],
};

const profiles = [
  {
    name: "Default",
    default: true,
    ff5: 'I don\'t remeber what this field is for',
    preferences: [
      {
        type: 'Air',
        value: 'Window seat'
      },
    ]
  },
  {
    name: "Yellow Elle",
    ff5: 'FF5',
  },
  {
    name: 'Jennie Kim',
    ff5: ''
  },
];

await db.set(["person", 3], person);

// 'profile', personId, profileId
await db.set(["profile", 3, 1], profiles[0]);
await db.set(["profile", 3, 2], profiles[1]);
await db.set(["profile", 3, 3], profiles[2]);