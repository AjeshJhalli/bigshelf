import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";
import modules from "./modules.ts";

export default function ModuleNav({ activeModule, oob = false }: { activeModule: string, oob: boolean }) {
  return (
    <ul
      id="module-nav"
      hx-swap-oob={oob ? "true" : "false"}
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
        hx-get={href}
        hx-target="#module-container"
        hx-push-url="true"
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
