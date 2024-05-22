import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function Tabs(
  { id, title, tabs, selectedTab, children, className, listClassName },
) {
  return (
    <section id={id} role="tablist" className="">
      {tabs.map((tab) => (
        tab.name === selectedTab
          ? (
            <span
              role="tab"
              className=""
              aria-label={tab.name}
            >
              {tab.name}
            </span>
          )
          : (
            <span
              role="tab"
              className=""
              hx-get={tab.href}
              hx-target={`#${id}`}
              hx-swap="outerHTML"
            >
              {tab.name}
            </span>
          )
      ))}
      <div role="tabpanel" className="">
        {children}
      </div>
    </section>
  );
}
