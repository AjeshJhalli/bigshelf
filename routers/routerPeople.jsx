import { Router } from 'jsr:@oak/oak/router';
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import People from '../templates/People.jsx';
import r from '../utils/r.jsx';
import routerPerson from './routerPerson.jsx';
import getPeople from './getPeople.js';

const env = await load();
const databaseUrl = env["DATABASE_URL"];
const pool = new Pool(databaseUrl, 3, true);
const connection = await pool.connect();

const routerPeople = new Router();

routerPeople
  .get('/', async (context) => {

    const people = await getPeople(connection);
    context.response.body = r(<People people={people} />);
    
  });

routerPeople.use('/:personId', routerPerson.routes());

export default routerPeople;