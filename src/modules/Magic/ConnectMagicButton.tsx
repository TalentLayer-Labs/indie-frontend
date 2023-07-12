import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';

const ConnectMagicButton = () => {
  const { magicProvider } = useContext(TalentLayerContext);

  if (typeof window !== 'undefined') {
    console.log('You are on the browser,You are good to go');
  } else {
    console.log('You are on the server,Cannot execute');
  }
  const handleConnect = async () => {
    try {
      if (magicProvider?.magic) {
        console.log('Connecting...');
        // await magicProvider.?magic?.user.logout();
        await magicProvider?.magic.wallet.connectWithUI();
        console.log(
          'handleConnect: magicProvider.?magic wallet:',
          await magicProvider?.magic?.wallet,
        );
      }
    } catch (error) {
      console.error('handleConnect:', error);
    }
  };

  return (
    <button
      className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'
      onClick={handleConnect}>
      Connect With Magic Ui
    </button>
  );
};

export default ConnectMagicButton;
