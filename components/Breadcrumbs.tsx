import { Breadcrumb } from "../types/types.ts";

export default function Breadcrumbs(
  { breadcrumbs }: { breadcrumbs: Array<Breadcrumb> },
) {
  if (breadcrumbs.length === 0) return null;

  return (
    <div className="breadcrumbs text-sm pb-6">
      <ul>
        {breadcrumbs.map((breadcrumb) => (
          <li>
            <a
              className="link"
              hx-get={breadcrumb.href}
              hx-target="#module-container"
            >
              {breadcrumb.displayName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
