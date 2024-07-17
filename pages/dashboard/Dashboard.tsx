import UserProfile from "./UserProfile.tsx";

export default function Dashboard({ user }) {
  return (
    <div className="">
      <UserProfile user={user} />
    </div>
  );
}
