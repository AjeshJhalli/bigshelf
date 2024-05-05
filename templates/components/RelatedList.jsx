import classNames from 'https://deno.land/x/classnames@0.1.1/index.ts';

export default function RelatedList({ title, items, display, borderless }) {
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
                  <button className='text-green-400 material-symbols-outlined'>
                    edit
                  </button>
                  <button className='text-red-400 material-symbols-outlined'>
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