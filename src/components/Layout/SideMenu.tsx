import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PresentationChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import SideLink from './SideLink';

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
        <SideLink key={item.name} href={item.href}>
          <item.icon className='mr-3 h-5 w-5 flex-shrink-0 text-indigo-300' aria-hidden='true' />
          {item.name}
        </SideLink>
      ))}
    </nav>
  );
}

export default SideMenu;
