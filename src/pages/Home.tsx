import ConnectId from '../components/ConnectId';
import Dashboard from './Dashboard';
import { useAccount } from 'wagmi';

function Home() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Dashboard />;
  }

  return <ConnectId />;
}

export default Home;
