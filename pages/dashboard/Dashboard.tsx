import { User } from "../../data/model.ts";
import UserProfile from "./UserProfile.tsx";

export default function Dashboard({ user }: { user: User }) {
  return (
    <UserProfile user={user} />
  );
}
