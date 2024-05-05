import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function DataCard({ title, fields, borderless, className }) {
  return (
    <section className={classNames('p-2 bg-white shadow', className, { 'shadow': !borderless })}>
      {title && <h3 className='font-semibold bg-cyan-300'>{title}</h3>}
      <div className='grid grid-cols-2 gap-y-2'>
        {fields ? 
          fields.map(field =>           
            <>
              <span className='font-semibold'>{field.name}</span>
              <span>{field.value}</span>
            </>
          )
        :
          'No data to display'
        }
      </div>
    </section>
  );
}