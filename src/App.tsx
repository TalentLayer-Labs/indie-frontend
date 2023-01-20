import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import Messaging from './pages/Messaging';
import { XmtpContextProvider } from './messaging/xmtp/context/XmtpContext';

const chains = [chain.goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: `${import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID}` }),
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
            <XmtpContextProvider>
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
                    <Route path='/messaging' element={<Messaging />} />
                    <Route path='/messaging/:address' element={<Messaging />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/profile/:id' element={<Profile />} />
                    <Route path='/profile/edit' element={<EditProfile />} />
                  </Route>
                </Routes>
              </div>
            </XmtpContextProvider>
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
