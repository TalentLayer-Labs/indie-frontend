import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useAccount, Web3Modal } from '@web3modal/react';
import type { ConfigOptions } from '@web3modal/core';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import NotLog from './pages/NotLog';

const config: ConfigOptions = {
  projectId: `${import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID}`,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'web3-boilerplate',
  },
};

function App() {
  const { account, isReady } = useAccount();

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='services' element={<Services />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='notlog' element={<NotLog />} />
      </Routes>
      <Web3Modal config={config} />
    </>
  );
}

export default App;
