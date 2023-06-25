import SideLink from './SideLink';

const navigation = [
  { name: 'Home', href: '/', icon: '/icons/home.svg', current: false },
  { name: 'Dashboard', href: '/dashboard', icon: '/icons/dashboard.svg', current: true },
  { name: 'Find bounties', href: '/services', icon: '/icons/find.png', current: false },
  { name: 'Post a bounty', href: '/services/create', icon: '/icons/post.svg', current: false },
  { name: 'Find talent', href: '/talents', icon: '/icons/talent.svg', current: false },
  { name: 'Messaging', href: '/messaging', icon: '/icons/message.svg', current: false },
];

function SideMenu() {
  return (
    <nav className='space-y-1 px-2'>
      {navigation.map(item => (
        <SideLink key={item.name} href={item.href}>
          <img
            src={item.icon}
            alt={item.name}
            className='mr-3 h-8 w-8 flex-shrink-0 text-white-300'
          />
          <span className='text-2xl'>{item.name}</span>
        </SideLink>
      ))}
    </nav>
  );
}

export default SideMenu;
