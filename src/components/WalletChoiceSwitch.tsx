import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useConnect } from 'wagmi';
import Loading from './Loading';

function WalletChoiceSwitch() {
  const { connectors, connect, isLoading, pendingConnector } = useConnect();
  const magicConnector = connectors[0];

  return (
    <Menu as='div' className='relative inline-block text-left mt-3'>
      <div className='flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
        {/*<button*/}
        {/*  // className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'*/}
        {/*  disabled={!magicConnector.ready}*/}
        {/*  key={magicConnector.id}*/}
        {/*  onClick={() => connect({ magicConnector })}>*/}
        {/*  {magicConnector.name}*/}
        {/*  {!magicConnector.ready}*/}
        {/*  {isLoading && magicConnector.id === pendingConnector?.id && <Loading />}*/}
        {/*</button>*/}
        Connect Wallet
        <Menu.Button>
          <ChevronDownIcon className='hover:bg-gray:500 -mr-1 ml-2 h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items
          defaultValue={0}
          className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            {connectors.map(connector => {
              return connector.id === 'magic' ? (
                <Menu.Item>
                  <div className='border-b border-t-gray-500'>
                    <button
                      // className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'
                      className={`block px-4 py-2 text-sm text-gray-700`}
                      disabled={!connector.ready}
                      key={connector.id}
                      onClick={() => connect({ connector })}>
                      {connector.name}
                      {!connector.ready}
                      {isLoading && connector.id === pendingConnector?.id && <Loading />}
                    </button>
                  </div>
                </Menu.Item>
              ) : (
                <Menu.Item>
                  <button
                    // className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'
                    className={`block px-4 py-2 text-sm text-gray-700`}
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}>
                    {connector.name}
                    {!connector.ready}
                    {isLoading && connector.id === pendingConnector?.id && <Loading />}
                  </button>
                </Menu.Item>
              );
            })}
            {/*<Menu.Item>*/}
            {/*<button*/}
            {/*  // className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'*/}
            {/*  className={`block px-4 py-2 text-sm text-gray-700`}*/}
            {/*  disabled={!connectors[0].ready}*/}
            {/*  key={connectors[0].id}*/}
            {/*  onClick={() => connect({ connectors[0] })}>*/}
            {/*  {connectors[0].name}*/}
            {/*  {!connectors[0].ready}*/}
            {/*  {isLoading && connectors[0].id === pendingConnector?.id && <Loading />}*/}
            {/*</button>*/}
            {/*  </Menu.Item>*/}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default WalletChoiceSwitch;
