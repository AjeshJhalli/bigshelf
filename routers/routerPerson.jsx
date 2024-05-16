import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import { Router } from 'jsr:@oak/oak/router';
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import Person from '../templates/person/Person.jsx';
import PersonRelatedDataTabs from '../templates/person/PersonRelatedDataTabs.jsx';
import PersonDataCard from '../templates/person/PersonDataCard.jsx';
import routerProfile from './routerProfile.jsx';
import r from '../utils/r.jsx';
import getPerson from './getPerson.js';

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

    const name_first = data.get('First Name');
    const name_last = data.get('Last Name');
    const gender = data.get('Gender');
    let dob = data.get('DOB');

    console.log(dob);

    if (!dob) {
      dob = null;
    }

    const personUpdateResponse = await connection.queryArray(`
      UPDATE
        person
      SET
        person_name_first = $name_first,
        person_name_last = $name_last,
        person_gender = $gender,
        person_dob = $dob
      WHERE
        z_pk_person = $personId
      `,
      { personId, name_first, name_last, gender, dob }
    );

    const personResponse = await connection.queryArray(`
      SELECT
        person_name_first,
        person_name_last,
        person_gender,
        person_dob
      FROM
        person
      WHERE
        z_pk_person = $personId
      `,
      { personId }
    );

    const person = {
      id: personId,
      name_first: personResponse.rows[0][0],
      name_last: personResponse.rows[0][1],
      gender: personResponse.rows[0][2],
      dob: personResponse.rows[0][3].toISOString().substring(0, 10)
    };

    context.response.body = render(<PersonDataCard person={person} />)
    
  })
  .get('/cancel-edit', async (context) => {

    const personId = parseInt(context.params.personId);
    const person = await db.get(['person', personId]);

    context.response.body = render(<PersonDataCard person={person} />);
    
  })
  .get('/:relatedDataTab', async (context) => {

    const personId = parseInt(context.params.personId)
    const relatedDataTab = context.params.relatedDataTab;

    const person = await getPerson(connection, personId);

    switch (relatedDataTab) {
      case 'email-addresses':
        context.response.body = render(<PersonRelatedDataTabs person={person} selectedTab='Email Addresses' />);
        break;

      case 'phone-numbers':
        context.response.body = render(<PersonRelatedDataTabs person={person} selectedTab='Phone Numbers' />);
        break;
      
      default:
        context.response.body = 'An unexpected error has occurred';
        context.response.status = 500;
    }

  })

routerPerson.use('/profiles/:profileId', routerProfile.routes());

export default routerPerson;