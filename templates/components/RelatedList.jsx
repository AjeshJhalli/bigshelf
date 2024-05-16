import classNames from 'https://deno.land/x/classnames@0.1.1/index.ts';

export default function RelatedList({ title, items, display, borderless, editable, deletable, extraButtons, editFormHref }) {
  return (
    <section className={classNames('bg-white', {'shadow p-2': !borderless})}>
      <h3 className='font-semibold text-gray-400 py-1 px-3'>{title}</h3>
      <ul className='flex flex-col gap-y-0.5 px-0.5 pb-0.5'>
        {
          items ?
            items.map(item =>
              <li className='py-1 px-3 flex justify-between border'>
                {item.href ?
                  <a href={item.href} className='text-blue-500 underline'>
                    {display(item)}
                  </a>
                  :
                  <span>
                    {display(item)}
                  </span>
                  }
                <div className='flex gap-x-5 px-5 text-white'>
                  {extraButtons}
                  <button
                    className='bg-green-400 text-white flex gap-x-3 items-center w-7 h-7 justify-center rounded material-symbols-outlined'
                    hx-get={`${editFormHref}/${item.id}`} hx-target='body' hx-swap='beforeend'
                  >
                    edit
                  </button>
                  <button className='bg-red-400 text-white flex gap-x-3 items-center w-7 h-7 justify-center rounded material-symbols-outlined'>
                    delete
                  </button>
                </div>
              </li>
            )
          :
            <span className='py-1 px-3'>No items to display</span>
        }
      </ul>
    </section>
  );
}