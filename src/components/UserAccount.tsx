import { Menu, Transition } from '@headlessui/react';
import { ConnectButton, useAccount, useDisconnect, useEnsAvatar } from '@web3modal/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getUserByAddress } from '../services/queries';
import { truncateAddress } from '../utils';
import UserHandle from './UserHandle';

function UserAccount() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const disconnect = useDisconnect();
  const { data: avatarImage } = useEnsAvatar({
    addressOrName: 'vitalik.eth',
  });

  return (
    <div className='flex flex-1 justify-between px-4'>
      <div className='flex flex-1'></div>
      <div className='ml-4 flex items-center md:ml-6'>
        {/* Profile dropdown */}
        <Menu as='div' className='relative ml-3'>
          <div>
            {account.isConnected === true ? (
              <div className='flex items-center'>
                <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2'>
                  <span className='sr-only'>Open user menu</span>
                  {avatarImage !== undefined ? (
                    <img className='h-8 w-8 rounded-full' alt='' src={avatarImage} />
                  ) : (
                    <img
                      className='h-8 w-8 rounded-full'
                      alt=''
                      src='https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png?format=png&width=960'
                    />
                  )}
                </Menu.Button>

                <Menu.Button className='ml-3 text-left'>
                  <p
                    className='text-sm font-medium text-gray-700 group-hover:text-gray-900'
                    style={{ marginBottom: '-3px' }}>
                    {account.isConnected && (
                      <UserHandle address={account.address.toLocaleLowerCase()} />
                    )}
                  </p>
                  <p className='text-xs font-medium text-gray-500 group-hover:text-gray-700'>
                    {truncateAddress(account.address)}
                  </p>
                </Menu.Button>
              </div>
            ) : (
              <ConnectButton />
            )}
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'>
            <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <Menu.Item key='Log out'>
                {({ active }) => (
                  <a
                    href='Log out'
                    onClick={event => {
                      event.preventDefault();
                      disconnect();
                      navigate('/');
                    }}
                    className={`block px-4 py-2 text-sm text-gray-700' ${
                      active ? 'bg-gray-100' : ''
                    }`}>
                    Log out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default UserAccount;
