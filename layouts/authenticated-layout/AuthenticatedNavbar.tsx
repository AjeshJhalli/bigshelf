export default function AuthenticatedNavbar() {
  return (
    <nav className="navbar bg-base-200 shadow-md">
      <div class="navbar-start">
        <label
          class="btn btn-square btn-ghost drawer-button"
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
      <div class="navbar-end flex gap-x-6 px-6 items-center">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost text-white btn-circle avatar bg-red-400"
        >
          AJ
        </div>
      </div>
    </nav>
  );
}
