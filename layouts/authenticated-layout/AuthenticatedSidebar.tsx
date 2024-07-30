export default function AuthenticatedSidebar({ activeTenant }: { activeTenant: string; }) {
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      >
      </label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content pt-14">
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href={`/${activeTenant}/customers`}>Customers</a>
        </li>
        <li className="disabled">
          <a>Module 3</a>
        </li>
        <li className="disabled">
          <a>Module 4</a>
        </li>
        <li>
          <a className="btn btn-primary btn-sm mt-10" href="/auth/sign-out">
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
}
