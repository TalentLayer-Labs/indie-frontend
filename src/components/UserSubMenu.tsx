import { Menu } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

function UserSubMenu() {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Menu.Item key='Log out'>
        {({ active }) => (
          <button
            onClick={event => {
              event.preventDefault();
              disconnect();
              navigate('/');
            }}
            className={`block px-4 py-2 text-sm text-left text-zinc-900 w-full ${
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
