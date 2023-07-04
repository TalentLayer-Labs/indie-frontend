import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ToastContainer } from 'react-toastify';
import { Chain, WagmiConfig, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { customChains } from '../chains';
import { TalentLayerProvider } from '../context/talentLayer';
import { MessagingProvider } from '../modules/Messaging/context/messging';
import { XmtpContextProvider } from '../modules/Messaging/context/XmtpContext';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
import { useEffect } from 'react';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';

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
  autoConnect: false,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

const connector = new MagicConnectConnector({
  chains: chains,
  options: {
    apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY as string, //required
    //...Other options
  },
});

const wagmiMagicClient = createClient({
  autoConnect: false,
  // connectors: modalConnectors({ appName: 'web3Modal', chains }),
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      // options: {
      //   name: 'Injected',
      //   shimDisconnect: true,
      // },
    }),
    new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY as string, //required
        //...Other options
      },
    }),
  ],
  provider,
});

// Web3Modal Ethereum Client
// const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // wagmiClient.autoConnect();
    wagmiMagicClient.autoConnect();
  }, []);

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <DefaultSeo />
      <ToastContainer position='bottom-right' />
      <WagmiConfig client={wagmiMagicClient}>
        <TalentLayerProvider>
          <XmtpContextProvider>
            <MessagingProvider>
              <ThemeProvider enableSystem={false}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            </MessagingProvider>
          </XmtpContextProvider>
        </TalentLayerProvider>
        {/*<Web3Modal*/}
        {/*  projectId={`${process.env.NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID}`}*/}
        {/*  ethereumClient={ethereumClient}*/}
        {/*/>*/}
      </WagmiConfig>
    </>
  );
}

export default MyApp;
