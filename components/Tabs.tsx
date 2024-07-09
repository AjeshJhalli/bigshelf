import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function Tabs(
  { tabsId, tabs, selectedTabName }: {
    tabsId: string;
    tabs: Array<any>;
    selectedTabName: string;
  },
) {
  function tabContent() {
    const tab = tabs.find((t) => t.name === selectedTabName);
    return tab.content(tab.data);
  }

  return (
    <div id={tabsId} className="">
      <ul className="tabs ">
        {tabs.map((tab) => (
          <li
            className={classNames("tab", {
              "tab-active bg-base-100": selectedTabName === tab.name,
            })}
            hx-get={tab.href}
            hx-target={`#${tabsId}`}
          >
            {tab.displayName}
          </li>
        ))}
      </ul>
      <div className="bg-base-100 min-h-[300px] p-6">{tabContent()}</div>
    </div>
  );
}
