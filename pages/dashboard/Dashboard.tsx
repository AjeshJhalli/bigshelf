export default function Dashboard({ user }) {
  return (
    <div>
      <p>I am a dashboard</p>
      <p>OID: {user.key[1]}</p>
      <p>First Name: {user.value.firstName}</p>
      <p>Last Name: {user.value.lastName}</p>
    </div>
  );
}
