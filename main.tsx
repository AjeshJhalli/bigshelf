import { Application } from "jsr:@oak/oak/application";
import middlewareAuth from "./middleware/authenticate.ts";
import routerIndex from "./routers/routerIndex.tsx";

const app = new Application();

app
  .use(async (context, next) => {
    context.response.headers.set("Content-Type", "text/html");
    await next();
  })
  .use(middlewareAuth)
  .use(routerIndex.routes())
  .use(routerIndex.allowedMethods());

await app.listen({ port: 8000 });
