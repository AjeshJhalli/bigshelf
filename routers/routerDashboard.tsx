import { Router } from "jsr:@oak/oak/router";
import r from "../utils/r.jsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import UserProfileEdit from "../pages/dashboard/UserProfileEdit.tsx";

const routerDashboard = new Router();

routerDashboard
  .get("/", (context) => {
    context.response.body = r(<Dashboard user={context.state.user} />);
  })
  .get("/me/edit", (context) => {
    context.response.body = r(<UserProfileEdit user={context.state.user} />);;
  });

export default routerDashboard;