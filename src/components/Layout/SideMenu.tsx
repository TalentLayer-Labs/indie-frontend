import {
  Cog6ToothIcon,
  ExclamationCircleIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

const navigation = [
  {
    name: 'Your dashboard',
    href: '/',
    icon: PresentationChartBarIcon,
    current: true,
    isContainer: true,
  },
  {
    name: 'Dispute',
    href: '/dispute',
    icon: ExclamationCircleIcon,
    current: false,
    isContainer: false,
  },
  {
    name: 'Configuration',
    href: '/configuration',
    icon: Cog6ToothIcon,
    current: false,
    isContainer: true,
  },
];

function SideMenu() {
  return (
    <nav className='space-y-1 px-2'>
      {navigation.map(item => (
        <NavLink
          key={item.name}
          to={item.href}
          end
          className={({ isActive }) =>
            (isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700') +
            ' group flex items-center px-2 py-2 text-base font-medium rounded-md ' +
            (item.isContainer ? '' : 'ml-5')
          }>
          <item.icon className='mr-3 h-5 w-5 flex-shrink-0 text-indigo-300' aria-hidden='true' />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default SideMenu;
