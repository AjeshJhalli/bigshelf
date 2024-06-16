const kv = await Deno.openKv();

const booking = {

  tourName: "NewJeans Summer 2024",
  artistName: "NewJeans",
  partyName: "",

  customer: {
    id: 1,
    name: "HYBE"
  },

  supplier: {
    id: 1,
    type: "Hotel",
    name: "Hilton Bedford"
  },

  sectors: [
    {
      id: 1,
      roomType: "Double",
      dateIn: "2024-11-12",
      dateOut: "2024-11-15",
      allocatedPersonIds: [1, 3, 4],
      smokingAllowed: false,
      notesFreeText: "",
      allocationLimit: 2
    },
    {
      id: 2,
      roomType: "Single",
      dateIn: "2024-11-12",
      dateOut: "2024-11-18",
      allocatedPersonIds: [4, 5],
      smokingAllowed: false,
      notesFreeText: "",
      allocationLimit: 1
    },
    {
      id: 3,
      roomType: "Single",
      dateIn: "2024-11-12",
      dateOut: "2024-11-18",
      allocatedPersonIds: [],
      smokingAllowed: true,
      notesFreeText: "",
      allocationLimit: 1
    }
  ]
};

await kv.set(['bigshelf_test', 'booking', 1], booking);