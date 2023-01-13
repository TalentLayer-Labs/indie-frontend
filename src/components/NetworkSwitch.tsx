import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useNetwork } from 'wagmi';
import NetworkLink from './NetworkLink';

const chainIdToName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 5:
      return 'Goerli';
    case 1337:
      return 'Localhost';
    default:
      return 'Unknown';
  }
};

function NetworkSwitch() {
  const network = useNetwork();

  if (network?.chain === undefined) {
    return null;
  }

  return (
    <Menu as='div' className='relative inline-block text-left mt-3'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
          {network?.chain?.id ? chainIdToName(network.chain.id) : 'Select a network'}

          <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5' aria-hidden='true' />
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
        <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            <Menu.Item key={5}>
              <NetworkLink chaindId={5} chainName='Goerli' />
            </Menu.Item>
            {/* {import.meta.env.DEV && (
              <Menu.Item key={1337}>
                <NetworkLink chaindId={1337} chainName='Localhost' />
              </Menu.Item>
            )} */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default NetworkSwitch;
