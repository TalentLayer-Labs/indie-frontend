import { useSwitchNetwork } from 'wagmi';
import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';

function NetworkLink({ chaindId, chainName }: { chaindId: number; chainName: string }) {
  const { switchNetwork } = useSwitchNetwork({
    chainId: chaindId,
  });
  const { account } = useContext(TalentLayerContext);
  const chain = account?.connector?.chains[0];

  if (!switchNetwork) {
    return null;
  }

  return (
    <a
      onClick={() => {
        switchNetwork();
      }}
      className={`cursor-pointer text-gray-700 block px-4 py-2 text-sm' ${
        chain?.id === chaindId ? 'bg-gray-100 ' : ''
      }`}>
      {chainName}
    </a>
  );
}

export default NetworkLink;
