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
import { Web3MailProvider } from '../modules/Web3Mail/context/web3mail';

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

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    wagmiClient.autoConnect();
  }, []);

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <DefaultSeo />
      <ToastContainer position='bottom-right' />
      <WagmiConfig client={wagmiClient}>
        <TalentLayerProvider>
          <Web3MailProvider>
            <XmtpContextProvider>
              <MessagingProvider>
                <ThemeProvider enableSystem={false}>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ThemeProvider>
              </MessagingProvider>
            </XmtpContextProvider>
          </Web3MailProvider>
        </TalentLayerProvider>
        <Web3Modal
          projectId={`${process.env.NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID}`}
          ethereumClient={ethereumClient}
        />
      </WagmiConfig>
    </>
  );
}

export default MyApp;
