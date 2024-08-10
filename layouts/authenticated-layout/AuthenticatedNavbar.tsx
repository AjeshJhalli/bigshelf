import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function AuthenticatedNavbar(
  { activeModule, activeTenant }: { activeModule: string; activeTenant: string },
) {
  return (
    <nav className="navbar bg-base-200">
      <div class="navbar-start">
        <label
          class="lg:hidden flex btn btn-square btn-ghost drawer-button"
          htmlFor="my-drawer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-5 h-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            >
            </path>
          </svg>
        </label>
        <a className="btn btn-ghost text-xl" href="/dashboard">
          <h1>Bigshelf</h1>
        </a>
      </div>
      <ul
        tabIndex={0}
        className="lg:flex hidden menu menu-horizontal w-full justify-center"
      >
        <li>
          <a
            className={classNames({ "active": activeModule === "dashboard" })}
            href="/dashboard"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            className={classNames({ "active": activeModule === "customers" })}
            href={`/${activeTenant}/customers`}
          >
            Customers
          </a>
        </li>
        <li className="disabled">
          <a>Module 3</a>
        </li>
        <li className="disabled">
          <a>Module 4</a>
        </li>
      </ul>
      <div className="navbar-end justify-end flex gap-x-6 px-6">
        <a className="btn btn-primary" href="/auth/sign-out">Sign Out</a>
      </div>
    </nav>
  );
}
