import { Router } from 'jsr:@oak/oak/router';

import People from '../templates/People.jsx';

import r from '../utils/r.jsx';
import routerPerson from './routerPerson.jsx';

const db = await Deno.openKv();

const routerPeople = new Router();

routerPeople
  .get('/', async (context) => {
    const people = await Array.fromAsync(db.list({ prefix: ['person'] }));
    context.response.body = r(<People people={people} />);
  });

routerPeople.use('/:personId', routerPerson.routes());

export default routerPeople;