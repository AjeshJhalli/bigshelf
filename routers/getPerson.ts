import { PoolClient } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export default async function getPerson(connection: PoolClient, personId: number) {

  const personResponse = await connection.queryArray(`
    SELECT
      person_name_first,
      person_name_last,
      person_gender,
      person_dob,
      person_job_title
    FROM
      person
    WHERE
      z_pk_person = $personId
    `,
    { personId }
  );

  const profilesResponse = await connection.queryArray(`
    SELECT
      z_pk_profile,
      z_fk_email_address_array,
      profile_name,
      profile_ff5
    FROM
      profile
    WHERE
      z_fk_person = $personId
    `,
    { personId }
  );

  const emailAddressesResponse = await connection.queryArray(`
    SELECT
      z_pk_email_address,
      email_address_value
    FROM
      email_address
    WHERE
      z_fk_person = $personId
    `,
    { personId }
  );

  const phoneNumbersResponse = await connection.queryArray(`
    SELECT
      phone_number_value
    FROM
      phone_number
    WHERE
      z_fk_person = $personId
    `,
    { personId }
  );

  return {
    id: personId,
    firstName: personResponse.rows[0][0],
    lastName: personResponse.rows[0][1],
    gender: personResponse.rows[0][2],
    dob: personResponse.rows[0][3]?.toISOString().substring(0, 10),
    jobTitle: personResponse.rows[0][4],
    profiles: profilesResponse.rows.map(([ id, linkedEmailAddresses, name, ff5 ]) => ({ id, linkedEmailAddresses, name, ff5 })),
    emailAddresses: emailAddressesResponse.rows.map(([ id, value ]) => ({ id, value }) ),
    phoneNumbers: phoneNumbersResponse.rows.map(([ value ]) => ({ value }) )
  };

}