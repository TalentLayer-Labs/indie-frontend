import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import './App.css';
import { TalentLayerProvider } from './context/talentLayer';
import About from './pages/About';
import CreateOrEditProposal from './pages/CreateOrEditProposal';
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

import PushMessaging from './pages/PushMessaging';
import { PushProvider } from './messaging/push/context/pushUser';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { customChains } from './chains';
import XmtpMessaging from './pages/XmtpMessaging';
import { XmtpContextProvider } from './messaging/xmtp/context/XmtpContext';
import { MessagingProvider } from './messaging/context/messging';

const chains: Chain[] = [customChains.polygonMumbai];

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

const WrapInMessagingContext = ({ children }: { children: JSX.Element }): JSX.Element => {
  if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
    return <XmtpContextProvider>{children}</XmtpContextProvider>;
  } else if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
    return <PushProvider>{children}</PushProvider>;
  } else {
    return children;
  }
};

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' />
      <WagmiConfig client={wagmiClient}>
        <BrowserRouter>
          <TalentLayerProvider>
            <WrapInMessagingContext>
              <MessagingProvider>
                <div className='antialiased'>
                  <Routes>
                    <Route path='/' element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path='/dashboard' element={<Dashboard />} />
                      <Route path='/services' element={<Services />} />
                      <Route path='/services/:id' element={<Service />} />
                      <Route path='/services/create' element={<CreateService />} />
                      <Route path='/services/:id/proposal' element={<CreateOrEditProposal />} />
                      <Route path='/talents' element={<Talents />} />
                      {import.meta.env.VITE_MESSENGING_TECH === 'push' && (
                        <>
                          <Route path='/messaging/' element={<PushMessaging />} />
                          <Route path='/messaging/:conversationType' element={<PushMessaging />} />
                          <Route
                            path='/messaging/:conversationType/:address'
                            element={<PushMessaging />}
                          />
                        </>
                      )}
                      {import.meta.env.VITE_MESSENGING_TECH === 'xmtp' && (
                        <>
                          <Route path='/messaging' element={<XmtpMessaging />} />
                          <Route path='/messaging/:address' element={<XmtpMessaging />} />
                        </>
                      )}
                      <Route path='/about' element={<About />} />
                      <Route path='/profile/:id' element={<Profile />} />
                      <Route path='/profile/edit' element={<EditProfile />} />
                    </Route>
                  </Routes>
                </div>
              </MessagingProvider>
            </WrapInMessagingContext>
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
