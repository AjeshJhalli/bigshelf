import { Router } from "jsr:@oak/oak/router";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import Customers from "../pages/customers/Customers.jsx";
import r from "../utils/r.jsx";

const kv = await Deno.openKv();

const routerCustomers = new Router();

routerCustomers
  .get("/", async (context) => {
    // const people = await getPeople(connection);

    const customers = await Array.fromAsync(kv.list({ prefix: ['bigshelf_test','customer'] }));

    context.response.body = r(<Customers customers={customers} />);
  })
  .get("/new", (context) => {
    context.response.body = 'form for creating a new customer';
  })
  .post("/new", async (context) => {

    // const data = await context.request.body.form();

    // const firstName = data.get('firstName');
    // const lastName = data.get('lastName');
    // const jobTitle = data.get('jobTitle');
    // let dob = data.get('dob');
    // const gender = data.get('gender');
    
    // if (!dob) {
    //   dob = null;
    // }

    // console.log(dob)

    // const personCreateResponse = await connection.queryArray(`
    //   INSERT INTO
    //     person
    //     (
    //       person_name_first,
    //       person_name_last,
    //       person_job_title,
    //       person_gender,
    //       person_dob
    //     )
    //   VALUES
    //     (
    //       $firstName,
    //       $lastName,
    //       $jobTitle,
    //       $gender,
    //       $dob
    //     )
    //   RETURNING
    //     z_pk_person
    //   `,
    //   { firstName, lastName, gender, dob, jobTitle }
    // );

    // const personId = personCreateResponse.rows[0][0];

    const customerId = 1;

    context.response.redirect(`/customers/${customerId}`);
  });

export default routerCustomers;
