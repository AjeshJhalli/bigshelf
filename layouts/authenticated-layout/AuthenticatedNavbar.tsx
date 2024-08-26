import ModuleNav from "./ModuleNav.tsx";

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
        <a
          className="btn btn-ghost text-xl"
          hx-get="/dashboard"
          hx-target="#module-container"
        >
          <h1>Bigshelf</h1>
        </a>
      </div>
      <ModuleNav activeModule={activeModule} oob={false} />
      <div className="navbar-end justify-end flex gap-x-6 px-6">
        <a className="btn btn-sm btn-primary" href="/auth/sign-out">Sign Out</a>
      </div>
    </nav>
  );
}
