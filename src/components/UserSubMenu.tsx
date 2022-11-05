import { Menu } from '@headlessui/react';
import { useDisconnect } from '@web3modal/react';
import { useNavigate } from 'react-router-dom';

function UserSubMenu() {
  const navigate = useNavigate();
  const disconnect = useDisconnect();

  return (
    <>
      <Menu.Item key='Log out'>
        {({ active }) => (
          <a
            href='Log out'
            onClick={event => {
              event.preventDefault();
              disconnect();
              navigate('/');
            }}
            className={`block px-4 py-2 text-sm text-gray-700' ${active ? 'bg-gray-100' : ''}`}>
            Log out
          </a>
        )}
      </Menu.Item>
      <Menu.Item key='Recovery'>
        {({ active }) => (
          <a
            href='recovery'
            onClick={event => {
              event.preventDefault();
              disconnect();
              navigate('/recovery');
            }}
            className={`block px-4 py-2 text-sm text-gray-700' ${active ? 'bg-gray-100' : ''}`}>
            Recover your ID
          </a>
        )}
      </Menu.Item>
    </>
  );
}

export default UserSubMenu;
