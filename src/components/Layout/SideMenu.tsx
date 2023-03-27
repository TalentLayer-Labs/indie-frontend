import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PresentationChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: 'Presentation', href: '/', icon: HomeIcon, current: false },
  { name: 'Your dashboard', href: '/dashboard', icon: PresentationChartBarIcon, current: true },
  { name: 'Find jobs', href: '/services', icon: MagnifyingGlassIcon, current: false },
  { name: 'Post a job', href: '/services/create', icon: PlusIcon, current: false },
  { name: 'Find talents', href: '/talents', icon: SparklesIcon, current: false },
  { name: 'Messaging', href: '/messaging', icon: ChatBubbleLeftIcon, current: false },
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
            ' group flex items-center px-2 py-2 text-base font-medium rounded-md'
          }>
          <item.icon className='mr-3 h-5 w-5 flex-shrink-0 text-indigo-300' aria-hidden='true' />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default SideMenu;
