import Link from 'next/link';

function Logo() {
  return (
    <h1 className='text-2xl text-white'>
      <Link href='/'>
        TL<span className='text-indigo-300'>indie</span>
      </Link>
    </h1>
  );
}

export default Logo;
