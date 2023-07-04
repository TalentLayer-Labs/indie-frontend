import { magic } from './lib/magic';
import useMagic from './hooks/useMagic';
import Web3 from 'web3';
import { ethers } from 'ethers';

const ConnectMagicButton = () => {
  const { magic, provider } = useMagic();

  const web3 = new Web3(provider);
  console.log('provider', provider);

  if (typeof window !== 'undefined') {
    console.log('You are on the browser,You are good to go');
  } else {
    console.log('You are on the server,Cannot execute');
  }
  // Define the event handler for the button click
  const handleConnect = async () => {
    try {
      if (magic) {
        // Try to connect to the wallet using Magic's user interface
        // console.log('handleConnect: magic wallet:', await magic?.wallet);
        // console.log('handleConnect: provider:', magic?.wallet.connectWithUI);
        // console.log('handleConnect: provider:', await magic?.wallet.connectWithUI());
        // await magic?.user.logout();
        await magic.wallet.connectWithUI();
        // console.log('handleConnect: magic user:', await magic?.user.getInfo());
        // TODDO Set a Magic context set with the user's Magic provider
        const web3Provider = await magic.wallet.getProvider().then(provider => {
          return new ethers.providers.Web3Provider(provider);
        });
        const signer = web3Provider.getSigner(0);
        console.log('web3Provider', web3Provider);
        console.log('signer', signer);
      }
    } catch (error) {
      // Log any errors that occur during the connection process
      console.error('handleConnect:', error);
    }
  };

  // Render the button component with the click event handler
  return <button onClick={handleConnect}>Connect</button>;
};

export default ConnectMagicButton;
