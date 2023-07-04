import CreateId from '../components/Home/CreateId';
import SearchService from '../components/Home/SearchService';
import SearchTalent from '../components/Home/SearchTalent';
import useMagic from '../modules/Magic/hooks/useMagic';
import { useProvider, useSigner } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

function Home() {
  const { magic } = useMagic();
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const router = useRouter();
  let tx: ethers.providers.TransactionResponse;

  const ethersProvider = new ethers.providers.JsonRpcProvider();
  console.log('ethersProvider', ethersProvider.getSigner(0));

  const printData = async () => {
    const web3Provider = await magic?.wallet.getProvider().then(provider => {
      return new ethers.providers.Web3Provider(provider);
    });
    const magicSigner = web3Provider?.getSigner(0);
    console.log('web3Provider', web3Provider);
    console.log('magicSigner', magicSigner);
    console.log('signer', signer);
  };
  return (
    <>
      <CreateId />
      <SearchService />
      <SearchTalent />
      <button onClick={() => printData()}>Print Data </button>
    </>
  );
}

export default Home;
