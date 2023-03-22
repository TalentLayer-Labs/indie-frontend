import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import './App.css';
import { TalentLayerProvider } from './context/talentLayer';
import About from './pages/About';
import CreateProposal from './pages/CreateProposal';
import CreateService from './pages/CreateService';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Profile from './pages/Profile';
import Service from './pages/Service';
import Services from './pages/Services';
import Talents from './pages/Talents';
import { Web3Modal } from '@web3modal/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// Global chartJS register
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { customChains } from './chains';
import ConfigurationPresentation from './pages/ConfigurationPresentation';
import ConfigurationFees from './pages/ConfigurationFees';
import ConfigurationDispute from './pages/ConfigurationDispute';
import ConfigurationControlCenter from './pages/ConfigurationControlCenter';

const chains: Chain[] = [customChains.fuji];

// Wagmi client
const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: chain => {
      return { http: chain.rpcUrls.default };
    },
  }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' />
      <WagmiConfig client={wagmiClient}>
        <BrowserRouter>
          <TalentLayerProvider>
            <div className='antialiased'>
              <Routes>
                <Route path='/' element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/services' element={<Services />} />
                  <Route path='/services/:id' element={<Service />} />
                  <Route path='/services/create' element={<CreateService />} />
                  <Route path='/services/:id/create-proposal' element={<CreateProposal />} />
                  <Route path='/talents' element={<Talents />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/profile/:id' element={<Profile />} />
                  <Route path='/profile/edit' element={<EditProfile />} />
                  <Route path='/configuration' element={<Navigate to='/configuration/presentation' />} />
                  <Route path='/configuration/presentation' element={<ConfigurationPresentation />} />
                  <Route path='/configuration/control-center' element={<ConfigurationControlCenter />} />
                  <Route path='/configuration/fees' element={<ConfigurationFees />} />
                  <Route path='/configuration/dispute' element={<ConfigurationDispute />} />
                </Route>
              </Routes>
            </div>
          </TalentLayerProvider>
        </BrowserRouter>
        <Web3Modal
          projectId={`${import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID}`}
          ethereumClient={ethereumClient}
        />
      </WagmiConfig>
    </>
  );
}

export default App;
