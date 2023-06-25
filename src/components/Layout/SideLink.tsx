import { useRouter } from 'next/router';

function SideLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();
  let className =
    router.asPath === href ? 'bg-red-600 text-white' : 'text-red-100 hover:bg-red-700';

  className += ' group flex items-center px-2 py-2 text-base font-medium rounded-md';

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={{ fontFamily: 'CustomFont' }}>
      {children}
    </a>
  );
}

export default SideLink;
