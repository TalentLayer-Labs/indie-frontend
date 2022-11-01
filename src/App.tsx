import type { ConfigOptions } from '@web3modal/core';
import { chains } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/services' element={<Services />} />
        <Route path='/talents' element={<Talents />} />
        <Route path='/about' element={<About />} />
      </Routes>
      <Web3Modal config={config} />
    </div>
  );
}

export default App;
