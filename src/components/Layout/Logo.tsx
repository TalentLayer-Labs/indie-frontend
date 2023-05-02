import { useRouter } from 'next/router';

function Logo() {
  return (
    <h1 className='text-2xl text-white'>
      <NavLink href='/'>
        TL<span className='text-indigo-300'>indie</span>
      </NavLink>
    </h1>
  );
}

export default Logo;
