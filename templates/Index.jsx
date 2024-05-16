export default function Index() {

  return (
    <>
      <h1 className="font-semibold text-2xl pb-4">Bigshelf</h1>
      <p className='py-4'>
        Bigshelf is a traveller profile management system. It is currently still in development.
        Below is a list of available modules:
      </p>
      <ul className='list-disc list-inside'>
        <li>
          <a className='text-blue-500 underline' href='/people/1'>People</a>
        </li>
      </ul>
    </>
  );

}