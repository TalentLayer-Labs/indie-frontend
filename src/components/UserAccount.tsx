import { Menu, Transition } from '@headlessui/react';
import { ConnectButton } from '@web3modal/react';
import { Fragment, useContext } from 'react';
import { useEnsAvatar } from 'wagmi';
import TalentLayerContext from '../context/talentLayer';
import { truncateAddress } from '../utils';
import UserSubMenu from './UserSubMenu';
import Image from 'next/image';

function UserAccount() {
  const { account, user } = useContext(TalentLayerContext);

  const { data: avatarImage } = useEnsAvatar();

  return (
    <div className='flex justify-between'>
      <div className='ml-4 px-4 flex items-center md:ml-6 border-l border-gray-200'>
        {/* Profile dropdown */}
        <Menu as='div' className='relative'>
          <div>
            {account && account.isConnected === true ? (
              <div className='flex items-center'>
                <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2'>
                  <span className='sr-only'>Open user menu</span>
                  {avatarImage ? (
                    <Image
                      className='h-8 w-8 rounded-full'
                      alt=''
                      src={avatarImage}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <Image
                      className='h-8 w-8 rounded-full'
                      alt=''
                      src={`/images/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
                      width={50}
                      height={50}
                    />
                  )}
                </Menu.Button>

                <Menu.Button className='ml-3 text-left'>
                  <p
                    className='text-sm font-medium text-gray-700 group-hover:text-gray-900'
                    style={{ marginBottom: '-3px' }}>
                    {user?.handle ? user.handle : ''}
                  </p>
                  <p className='text-xs font-medium text-gray-500 group-hover:text-gray-700'>
                    {account.address && truncateAddress(account.address)}
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
              <UserSubMenu />
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default UserAccount;
