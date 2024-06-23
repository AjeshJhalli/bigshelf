import UserProfile from "./UserProfile.tsx";

export default function Dashboard({ user }) {
  return (
    <div className="grid grid-cols-2">
      <UserProfile user={user} />
    </div>
  );
}
