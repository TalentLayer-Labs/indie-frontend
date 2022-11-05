import type { ConfigOptions } from '@web3modal/core';
import { chains } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import CreateService from './pages/CreateService';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Service from './pages/Service';
import Services from './pages/Services';
import Talents from './pages/Talents';

const config: ConfigOptions = {
  projectId: `${import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID}`,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'TalentLayer Workshop',
    chains: [chains.goerli, chains.mainnet, chains.localhost, chains.polygon],
  },
};

function App() {
  return (
    <div className='antialiased'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/services' element={<Services />} />
            <Route path='/services/:id' element={<Service />} />
            <Route path='/services/create' element={<CreateService />} />
            <Route path='/talents' element={<Talents />} />
            <Route path='/about' element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Web3Modal config={config} />
    </div>
  );
}

export default App;
