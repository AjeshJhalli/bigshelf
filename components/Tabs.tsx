import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";
import { Tab } from "../types/types.ts";

export default function Tabs(
  { tabsId, tabs }: {
    tabsId: string;
    tabs: Array<Tab>;
  },
) {
  function tabContent() {
    const tab = tabs.find(t => t.selected);
    if (!tab || !tab.selected) return null;
    return tab.content;
  }

  return (
    <div id={tabsId} className="h-full">
      <ul className="tabs tabs-bordered max-w-[600px]">
        {tabs.map((tab) => (
          <li
            className={classNames("tab", {
              "tab-active": tab.selected,
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
