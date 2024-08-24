import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";
import modules from "./modules.ts";

export default function AuthenticatedSidebar(
  { activeModule }: { activeModule: string },
) {
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      >
      </label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content pt-14">
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
        <li>
          <a className="btn btn-primary btn-sm mt-10" href="/auth/sign-out">
            Sign Out
          </a>
        </li>
      </ul>
    </div>
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
