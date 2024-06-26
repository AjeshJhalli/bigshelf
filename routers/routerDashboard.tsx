import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.jsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import UserProfileEdit from "../pages/dashboard/UserProfileEdit.tsx";
import encodeDate from "../utils/encodeDate.ts";
import { Day, Month, Year } from "../types/types.ts";

const kv = await Deno.openKv();

const routerDashboard = new Router();

routerDashboard
  .get("/", (context) => {
    context.response.body = r(<Dashboard user={context.state.user} />);
  })
  .get("/me/edit", (context) => {
    context.response.body = r(<UserProfileEdit user={context.state.user} />);;
  })
  .post("/me/edit", async (context) => {

    const user = context.state.user;

    const data = await context.request.body.formData();

    data.forEach(console.log)

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const jobTitle = data.get("jobTitle");
    const gender = data.get("gender");

    const dobYear = data.get("dobYear")?.toString() || "";
    const dobMonth = data.get("dobMonth")?.toString() || "";;
    const dobDay = data.get("dobDay")?.toString() || "";;

    const dob = encodeDate(dobYear, dobMonth, dobDay);

    const prevUser = await kv.get(user.key);

    await kv.set(user.key, {
      ...(prevUser.value as object),
      firstName,
      lastName,
      jobTitle,
      gender,
      dob
    });

    context.response.redirect(`/dashboard`);

  });

export default routerDashboard;