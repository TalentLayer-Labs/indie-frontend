import { useNetwork } from 'wagmi';

const network = useNetwork();
const chainId = network?.chain?.id;
export const renderExplorerUri = () => {
  switch (chainId) {
    case 1:
      return 'https://etherscan.io/tx/';
    case 5:
      return 'https://goerli.etherscan.io/tx/';
    case 1337:
      return 'Localhost';
    case 43113:
      return 'https://testnet.snowtrace.io/tx/';
    case 80001:
      return 'https://mumbai.polygonscan.com/tx/';
    case 137:
      return 'https://polygonscan.com/tx/';
    default:
      return 'Unknown';
  }
};
export const renderExplorerName = () => {
  switch (chainId) {
    case 1:
      return 'Follow on etherscan';
    case 5:
      return 'Follow on goerli etherscan';
    case 1337:
      return 'Localhost';
    case 43113:
      return 'Follow on snowtrace';
    case 80001:
      return 'Follow on mumbai polygonscan';
    case 137:
      return 'Follow on polygonscan';
    default:
      return 'Unknown';
  }
};
