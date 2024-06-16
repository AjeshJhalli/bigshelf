export default async function getPeople(connection) {
  const peopleResponse = await connection.queryArray(`
    SELECT
      z_pk_person,
      person_name_first,
      person_name_last,
      person_job_title,
      person_dob
    FROM
      person
    `);

  return peopleResponse.rows.map((person) => ({
    id: person[0],
    firstName: person[1],
    lastName: person[2],
    jobTitle: person[3],
    dob: new Date(person[4]).toLocaleString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
  }));
}
