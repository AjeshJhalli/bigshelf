import { Router } from "jsr:@oak/oak/router";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import People from "../pages/People.jsx";
import r from "../utils/r.jsx";
import routerPerson from "./routerPerson.tsx";
import getPeople from "./getPeople.ts";
import PersonForm from "../pages/person/PersonForm.tsx";

// const env = await load();
// const databaseUrl = Deno.env.get("DATABASE_URL");
// const pool = new Pool(databaseUrl, 3, true);
// const connection = await pool.connect();

const routerPeople = new Router();

routerPeople
  .get("/", async (context) => {
    const people = await getPeople(connection);
    context.response.body = r(<People people={people} />);
  })
  .get("/new", (context) => {
    context.response.body = r(<PersonForm newPerson={true} />);
  })
  .post("/new", async (context) => {

    const data = await context.request.body.form();

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const jobTitle = data.get('jobTitle');
    let dob = data.get('dob');
    const gender = data.get('gender');
    
    if (!dob) {
      dob = null;
    }

    console.log(dob)

    const personCreateResponse = await connection.queryArray(`
      INSERT INTO
        person
        (
          person_name_first,
          person_name_last,
          person_job_title,
          person_gender,
          person_dob
        )
      VALUES
        (
          $firstName,
          $lastName,
          $jobTitle,
          $gender,
          $dob
        )
      RETURNING
        z_pk_person
      `,
      { firstName, lastName, gender, dob, jobTitle }
    );

    const personId = personCreateResponse.rows[0][0];

    context.response.redirect(`/people/${personId}`);
  });

routerPeople.use("/:personId", routerPerson.routes());

export default routerPeople;
