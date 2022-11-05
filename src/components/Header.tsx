import { NavLink } from 'react-router-dom';
import Nav from './Nav';
import UserAccount from './UserAccount';

function Header() {
  return (
    <div className='bg-white  pt-4  pb-4 border-b border-gray-200'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-between items-center relative'>
          <div className='flex justify-start items-center gap-20'>
            <h1 className='text-2xl'>
              TL<span className='text-indigo-600'>indie</span>
            </h1>

            <Nav />
          </div>

          <UserAccount />
        </div>
      </div>
    </div>
  );
}

export default Header;
