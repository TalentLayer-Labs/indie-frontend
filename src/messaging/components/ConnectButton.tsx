import { useContext } from 'react';
import MessagingContext from '../context/messging';

function ConnectButton() {
  const { handleRegisterToMessaging } = useContext(MessagingContext);

  const renderText = () => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') return 'Connect to XMTP';
    else if (import.meta.env.VITE_MESSENGING_TECH === 'push') return 'Connect to Push';
  };

  return (
    <button
      type='submit'
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={() => handleRegisterToMessaging()}>
      {renderText()}
    </button>
  );
}

export default ConnectButton;
