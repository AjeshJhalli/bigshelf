export type TypePerson = {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
  dob: string;
};

export type User = {
  key: ["user", string];
  value: {
    firstName: string,
    lastName: string,
    jobTitle: string | undefined;
    gender: string | undefined;
    dob: string | undefined;
  }
};