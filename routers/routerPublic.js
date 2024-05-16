import { Router } from 'jsr:@oak/oak/router';

const routerPublic = new Router();

routerPublic
  .get('/main.js', async (context) => {

    try {

      const text = await Deno.readTextFile('./public/scripts/main.js');
      context.response.headers.set("Content-Type", "text/javascript")
      context.response.body = text;

    } catch {

      context.response.body = 'An unexpected error has occurred';
      context.response.status = 500;

    }

  });

export default routerPublic;