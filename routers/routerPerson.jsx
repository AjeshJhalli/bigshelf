import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import { Router } from 'jsr:@oak/oak/router';
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import Person from '../templates/person/Person.jsx';
import PersonDataCard from '../templates/person/PersonDataCard.jsx';
import routerProfile from './routerProfile.jsx';
import r from '../utils/r.jsx';
import getPerson from './getPerson.js';
import PersonTabContent from '../templates/person/PersonTabContent.jsx';
import PersonForm from '../templates/person/PersonForm.jsx';

const env = await load();
const databaseUrl = env["DATABASE_URL"];
const pool = new Pool(databaseUrl, 3, true);
const connection = await pool.connect();

const db = await Deno.openKv();

const routerPerson = new Router();

routerPerson
  .get('/', async (context) => {

    const personId = parseInt(context.params.personId);

    if (!personId) {
      context.response.body = 'Bad request';
      context.response.status = 418;
    } else {

      const person = await getPerson(connection, personId);

      try {
        context.response.body = r(<Person person={person} />);
      } catch (err) {
        console.error(err);
        context.response.body = JSON.stringify(err);
        context.response.status = 500;
      }
    }

  })
  .post('/edit', async (context) => {

    const personId = parseInt(context.params.personId);

    const data = await context.request.body.form();

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const jobTitle = data.get('jobTitle');
    let dob = new Date(data.get('dob'));
    const gender = data.get('gender');
    

    if (!dob) {
      dob = new Date();
    }

    console.log(dob)

    const personUpdateResponse = await connection.queryArray(`
      UPDATE
        person
      SET
        person_name_first = $firstName,
        person_name_last = $lastName,
        person_job_title = $jobTitle,
        person_gender = $gender,
        person_dob = $dob
      WHERE
        z_pk_person = $personId
      `,
      { personId, firstName, lastName, gender, dob, jobTitle }
    );

    const person = await getPerson(connection, personId);

    context.response.body = render(<PersonDataCard person={person} />)
    
  })
  .get('/cancel-edit', async (context) => {

    const personId = parseInt(context.params.personId);
    const person = await getPerson(connection, personId);

    context.response.body = render(<PersonDataCard person={person} />);

  })
  .get('/edit-form', async (context) => {

    const personId = parseInt(context.params.personId);
    const person = await getPerson(connection, personId);

    context.response.body = render(<PersonForm person={person} />);

  })
  .get('/:relatedDataTab', async (context) => {

    const personId = parseInt(context.params.personId)
    const relatedDataTab = context.params.relatedDataTab;

    const person = await getPerson(connection, personId);

    switch (relatedDataTab) {
      case 'email-addresses':
      case 'phone-numbers':
        context.response.body = render(<PersonTabContent person={person} selectedTab={relatedDataTab} />);
        break;
      
      default:
        context.response.body = 'An unexpected error has occurred';
        context.response.status = 500;
    }

  });


routerPerson.use('/profiles/:profileId', routerProfile.routes());

export default routerPerson;