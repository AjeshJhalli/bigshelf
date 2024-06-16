

export type TypePerson = {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
  dob: string;
};

const testPerson: TypePerson = {
  id: 1,
  firstName: "Ajesh",
  lastName: "Jhalli",
  jobTitle: "Software Engineer",
  gender: "Male",
  dob: "2002-11-12"
};

console.log(testPerson);