import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import Index from './templates/Index.jsx';
import r from './utils/r.jsx';

import routerPeople from './routers/routerPeople.jsx';
import routerPublic from './routers/routerPublic.js';

const router = new Router();
const app = new Application();

router
  .get('/', context => {
    context.response.body = r(<Index />);
  });

router.use('/public', routerPublic.routes());
router.use('/people', routerPeople.routes());

app.use(async (context, next) => {
  context.response.headers.set('Content-Type', 'text/html');
  await next();
});

app.use(router.routes());

app.use(router.allowedMethods());

await app.listen({ port: 8000 });