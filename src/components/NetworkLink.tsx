import { useNetwork, useSwitchNetwork } from '@web3modal/react';

function NetworkLink({ chaindId, chainName }: { chaindId: number; chainName: string }) {
  const { switchNetwork } = useSwitchNetwork({
    chainId: chaindId,
  });
  const { network } = useNetwork();

  return (
    <a
      onClick={() => {
        switchNetwork();
      }}
      className={`cursor-pointer text-gray-700 block px-4 py-2 text-sm' ${
        network?.chain?.id === chaindId ? 'bg-gray-100 ' : ''
      }`}>
      {chainName}
    </a>
  );
}

export default NetworkLink;
