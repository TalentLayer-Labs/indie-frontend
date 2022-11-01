import { NavLink } from 'react-router-dom';
import Nav from './Nav';
import UserAccount from './UserAccount';

function Header() {
  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-between items-center pt-4 relative'>
          <div className='flex justify-start items-center gap-20'>
            <h1 className='text-2xl'>
              TL<span className='text-indigo-600'>Workshop</span>
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
