import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function DataCard({ title, fields, borderless, className, editHref, id, cancelHref }) {
  return (
    <form
      id={id}
      className={classNames('p-3 bg-white shadow flex flex-col justify-between h-full',
        className,
        { 'shadow': !borderless }
      )}
      hx-post={editHref}
      hx-swap='outerHTML'
    >
      {title && <h3 className='font-semibold bg-cyan-300'>{title}</h3>}
      <div className='grid grid-cols-2 gap-y-2'>
        {fields ? 
          fields.map(field =>           
            <>
              <span className='font-semibold'>{field.name}</span>
              <input
                className='border border-gray-300 rounded px-2 h-7'
                name={field.name}
                type={field.type === 'dropdown' ? 'text' : field.type}
                value={field.value}
                disabled={!field.editable}
                onInput={`showSaveAndCancelButtons('${id}-button')`}
              />
            </>
          )
        :
          'No data to display'
        }
      </div>
      <div className='flex justify-end text-white gap-x-2'>
        <button
          type='button'
          className={`${id}-button hidden bg-red-400 rounded w-20 px-2`}
          hx-get={cancelHref}
          hx-target={`#${id}`}
        >
          Cancel
        </button>
        <button type='submit' className={`${id}-button hidden bg-green-400 rounded w-20 px-2`}>
          Save
        </button>
      </div>
    </form>
  );
}