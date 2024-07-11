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
    <div id={tabsId} className="h-full">
      <ul className="tabs tabs-bordered max-w-[600px]">
        {tabs.map((tab) => (
          <li
            className={classNames("tab", {
              "tab-active": selectedTabName === tab.name,
            })}
            hx-get={tab.href}
            hx-target={`#${tabsId}`}
          >
            {tab.displayName}
          </li>
        ))}
      </ul>
      <div className="min-h-[300px] py-6 w-full h-full">{tabContent()}</div>
    </div>
  );
}
