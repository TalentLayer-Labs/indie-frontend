import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import type { AppProps } from 'next/app';
import { Chain, WagmiConfig, configureChains, createClient } from 'wagmi';
import { customChains } from '../chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { ToastContainer } from 'react-toastify';
import { Web3Modal } from '@web3modal/react';
import { TalentLayerProvider } from '../context/talentLayer';
import { XmtpContextProvider } from '../messaging/xmtp/context/XmtpContext';
import { PushProvider } from '../messaging/push/context/pushUser';
import { MessagingProvider } from '../messaging/context/messging';
import Layout from './Layout';

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
  if (process.env.NEXT_PUBLIC_MESSENGING_TECH === 'xmtp') {
    return <XmtpContextProvider>{children}</XmtpContextProvider>;
  } else if (process.env.NEXT_PUBLIC_MESSENGING_TECH === 'push') {
    return <PushProvider>{children}</PushProvider>;
  } else {
    return children;
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <DefaultSeo />
      <ToastContainer position='bottom-right' />
      <WagmiConfig client={wagmiClient}>
        <TalentLayerProvider>
          <WrapInMessagingContext>
            <MessagingProvider>
              <ThemeProvider enableSystem={false}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            </MessagingProvider>
          </WrapInMessagingContext>
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
