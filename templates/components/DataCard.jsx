import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function DataCard({ title, fields, borderless, className, editHref, id, cancelHref }) {
  return (
    <form
      id={id}
      className='card w-96 bg-base-100 shadow-xl'
      hx-post={editHref}
      hx-swap='outerHTML'
    >
      <div className='card-body'>
        {title && <h3 className='card-title'>{title}</h3>}
        {fields ? 
          fields.map(field =>           
            <>
              <span className='font-semibold'>{field.name}</span>
              <input
                className='input input-bordered w-full max-w-xs'
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
      <div className='card-actions'>
        <button
          type='button'
          className={``}
          hx-get={cancelHref}
          hx-target={`#${id}`}
        >
          Cancel
        </button>
        <button type='submit'>
          Save
        </button>
      </div>
    </form>
  );
}