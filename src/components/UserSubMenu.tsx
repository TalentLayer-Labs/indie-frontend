import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDisconnect } from 'wagmi';

function UserSubMenu() {
  const router = useRouter();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Menu.Item key='editProfile'>
        {({ active }) => (
          <Link
            href='/profile/edit'
            className={`block px-4 py-2 text-sm text-gray-700' ${active ? 'bg-gray-100' : ''}`}>
            Edit my profile
          </Link>
        )}
      </Menu.Item>

      <Menu.Item key='Log out'>
        {({ active }) => (
          <button
            onClick={event => {
              event.preventDefault();
              disconnect();
              router.push('/');
            }}
            className={`block px-4 py-2 text-sm text-left text-red-700 w-full ${
              active ? 'bg-gray-100' : ''
            }`}>
            Log out
          </button>
        )}
      </Menu.Item>
    </>
  );
}

export default UserSubMenu;
