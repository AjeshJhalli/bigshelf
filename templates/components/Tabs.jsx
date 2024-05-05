import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function Tabs({ id, title, tabs, selectedTab, children, className, listClassName }) {
  return (
    <section id={id} className={classNames('flex flex-col bg-white shadow', className)}>
      {title && <h3 className='font-semibold pb-3'>{title}</h3>}
      <ul className='flex shadow text-blue-500'>
        {tabs.map((tab) => (
          tab.name === selectedTab ?
            <li className='max-w-72 text-center font-semibold px-5 py-1 cursor-pointer' hx-get={tab.href} hx-target={`#${id}`} hx-swap='outerHTML'>
              {tab.name}
            </li>
          :
            <li className='max-w-72 text-center px-5 py-1 cursor-pointer' hx-get={tab.href} hx-target={`#${id}`} hx-swap='outerHTML'>
              {tab.name}
            </li>
        ))}
      </ul>
      <div className={classNames(' flex flex-col gap-3 p-3', listClassName)}>
        {children}
      </div>
    </section>
  );
}