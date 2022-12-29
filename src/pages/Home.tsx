import CreateId from '../components/Home/CreateId';
import Dashboard from './Dashboard';
import { useAccount } from 'wagmi';

function Home() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Dashboard />;
  }

  return <CreateId />;
}

export default Home;
