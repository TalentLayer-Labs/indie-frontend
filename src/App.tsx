import type { ConfigOptions } from '@web3modal/core';
import { chains, providers } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { TalentLayerProvider } from './context/talentLayer';
import About from './pages/About';
import CreateProposal from './pages/CreateProposal';
import CreateReview from './pages/CreateReview';
import CreateService from './pages/CreateService';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Profile from './pages/Profile';
import Service from './pages/Service';
import Services from './pages/Services';
import Talents from './pages/Talents';

const config: ConfigOptions = {
  projectId: `${import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID}`,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'TalentLayer indie',
    chains: [chains.goerli],
  },
};

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' />
      <div className='antialiased'>
        <BrowserRouter>
          <TalentLayerProvider>
            <Web3Modal config={config} />
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/services' element={<Services />} />
                <Route path='/services/:id' element={<Service />} />
                <Route path='/services/create' element={<CreateService />} />
                <Route path='/services/:id/create-proposal' element={<CreateProposal />} />
                <Route path='/services/:id/create-review' element={<CreateReview />} />
                <Route path='/talents' element={<Talents />} />
                <Route path='/about' element={<About />} />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/profile/edit' element={<EditProfile />} />
              </Route>
            </Routes>
          </TalentLayerProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
