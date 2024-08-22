import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

type Module = {
  name: string;
  displayName: string;
  href: string;
  disabled: false;
} | {
  displayName: string;
  disabled: true;
};

const modules: Array<Module> = [
  {
    name: "dashboard",
    displayName: "Dashboard",
    href: "/dashboard",
    disabled: false,
  },
  {
    name: "customers",
    displayName: "Customers",
    href: "/customers",
    disabled: false,
  },
  {
    displayName: "Suppliers",
    disabled: true,
  },
  {
    name: "inventory",
    displayName: "Inventory",
    href: "/inventory",
    disabled: false,
  },
  {
    displayName: "Bookings",
    disabled: true,
  },
];

export default function AuthenticatedNavbar(
  { activeModule }: {
    activeModule: string;
  },
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
        {modules.map((module) => (
          module.disabled
            ? <ModuleButtonDisabled displayName={module.displayName} />
            : (
              <ModuleButtonEnabled
                name={module.name}
                displayName={module.displayName}
                href={module.href}
                activeModule={activeModule}
              />
            )
        ))}
      </ul>
      <div className="navbar-end justify-end flex gap-x-6 px-6">
        <a className="btn btn-sm btn-primary" href="/auth/sign-out">Sign Out</a>
      </div>
    </nav>
  );
}

function ModuleButtonEnabled(
  { name, href, displayName, activeModule }: {
    name: string;
    displayName: string;
    href: string;
    activeModule: string;
  },
) {
  return (
    <li>
      <a
        className={classNames({
          "active": activeModule === name,
        })}
        href={href}
      >
        {displayName}
      </a>
    </li>
  );
}

function ModuleButtonDisabled(
  { displayName }: {
    displayName: string;
  },
) {
  return (
    <li className="disabled">
      <span>
        {displayName}
      </span>
    </li>
  );
}
