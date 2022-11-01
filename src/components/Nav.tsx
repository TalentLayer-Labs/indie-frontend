import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <div className='hidden lg:block'>
      <ul className='flex flex-row gap-8'>
        <NavLink
          to={'/'}
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 hover:border-b-2 hover:border-indigo-600 py-2'
              : 'text-gray-900 hover:border-b-2 hover:text-indigo-600 hover:border-indigo-600 py-2'
          }>
          Home
        </NavLink>
        <NavLink
          to={'/services'}
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 hover:border-b-2 hover:border-indigo-600 py-2'
              : 'text-gray-900 hover:border-b-2 hover:text-indigo-600 hover:border-indigo-600 py-2'
          }>
          Find Gigs
        </NavLink>

        <NavLink
          to={'/talents'}
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 hover:border-b-2 hover:border-indigo-600 py-2'
              : 'text-gray-900 hover:border-b-2 hover:text-indigo-600 hover:border-indigo-600 py-2'
          }>
          Find Talents
        </NavLink>

        <NavLink
          to={'/about'}
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 hover:border-b-2 hover:border-indigo-600 py-2'
              : 'text-gray-900 hover:border-b-2 hover:text-indigo-600 hover:border-indigo-600 py-2'
          }>
          About us
        </NavLink>
      </ul>
    </div>
  );
}

export default Nav;
