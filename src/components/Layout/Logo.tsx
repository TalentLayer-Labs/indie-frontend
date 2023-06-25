import Link from 'next/link';

function Logo() {
  return (
    <div className='flex items-center'>
      <img src='/icon.png' alt='Logo' className='w-11 h-11 mr-2' />
      <h1 className='text-4xl text-white' style={{ fontFamily: 'CustomFont' }}>
        <Link href='/'>V-LANCE</Link>
      </h1>
    </div>
  );
}

export default Logo;
