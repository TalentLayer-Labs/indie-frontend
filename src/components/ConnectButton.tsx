import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import ConnectMagicButton from '../modules/Magic/ConnectMagicButton';

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  console.log('connectors', connectors);
  console.log('address', address);
  console.log('isConnected', isConnected);
  const magicConnector = connectors[0];
  const metamaskConnector = connectors[1];
  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  return (
    <>
      <button
        className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'
        onClick={() => magicConnector.connect()}>
        Connect Magic
      </button>
      <button
        className='px-5 py-2 mx-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-500'
        onClick={() => metamaskConnector.connect()}>
        Connect Metamask
      </button>
      <ConnectMagicButton />
    </>
  );
  // connectors.map(connector => {
  //   return <button onClick={() => connector.connect()}>Connect Wallet</button>;
  // });
}

export default ConnectButton;
