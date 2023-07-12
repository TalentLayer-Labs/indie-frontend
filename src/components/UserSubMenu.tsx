import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDisconnect } from 'wagmi';
import { useContext, useEffect, useState } from 'react';
import TalentLayerContext from '../context/talentLayer';

function UserSubMenu() {
  const router = useRouter();
  const { magicProvider } = useContext(TalentLayerContext);
  const [showMagicTab, setShowMagicTab] = useState(false);
  const { disconnect } = useDisconnect();

  const checkWalletType = async () => {
    //TODO - A tester avec connexion
    try {
      const walletInfo = await magicProvider?.magic?.user.getInfo();
      console.log('UserSubMenu walletInfo', walletInfo);
      const isMagicWallet = walletInfo?.walletType === 'magic';
      // const isMagicWallet = connector === 'magic';
      setShowMagicTab(isMagicWallet);
    } catch (error) {
      // Log any errors that occur during the wallet type check process
      console.error('checkWalletType:', error);
    }
  };

  useEffect(() => {
    checkWalletType();
  }, [magicProvider?.magic]);

  const handleShowUI = async () => {
    try {
      const walletInfo = await magicProvider?.magic?.user.getInfo();
      console.log('walletInfo', walletInfo);
      // await magic?.wallet.showUI();
    } catch (error) {
      console.error('handleShowUI:', error);
    }
  };

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

      {showMagicTab && (
        <Menu.Item key='showMagicData'>
          {({ active }) => (
            <button
              className={`block px-4 py-2 text-sm text-gray-700' ${active ? 'bg-gray-100' : ''}`}
              onClick={() => handleShowUI()}>
              Show magic wallet
            </button>
          )}
        </Menu.Item>
      )}

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
