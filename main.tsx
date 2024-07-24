import { Application } from "jsr:@oak/oak/application";
import { azureB2CAuth } from "./middleware/authenticate.ts";
import routerIndex from "./routers/routerIndex.tsx";

const app = new Application();

// const kv = await Deno.openKv();

// const users = kv.list({ prefix: ["user"]})

// for await (const user of users) {
//   await kv.delete(user.key);
// }



app
  .use(async (context, next) => {
    context.response.headers.set("Content-Type", "text/html");
    await next();
  })
  .use(azureB2CAuth)
  .use(routerIndex.routes())
  .use(routerIndex.allowedMethods());

await app.listen({ port: 8000 });
