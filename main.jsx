import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import Index from './templates/Index.jsx';
import r from './utils/r.jsx';

import routerPeople from './routers/routerPeople.jsx';
import routerPublic from './routers/routerPublic.js';
import routerAuth from './routers/routerAuth.jsx';

const env = await load();

const router = new Router();
const app = new Application();

router
  .get('/', context => {
    context.response.body = r(<Index />);
  });

router.use('/public', routerPublic.routes());
router.use('/auth', routerAuth.routes());
router.use('/people', routerPeople.routes());

app.use(async (context, next) => {
  context.response.headers.set('Content-Type', 'text/html');
  await next();
});

app.use(router.routes());

app.use(router.allowedMethods());

await app.listen({ port: 8000 });