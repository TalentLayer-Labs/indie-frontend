import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';
import { publicProvider } from '@wagmi/core/providers/public';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { polygonMumbai } from '@wagmi/core/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { TalentLayerProvider } from '../context/talentLayer';
import { XmtpContextProvider } from '../modules/Messaging/context/XmtpContext';
import { MessagingProvider } from '../modules/Messaging/context/messging';
import '../styles/globals.css';
import Layout from './Layout';
import { InjectedConnector } from 'wagmi/connectors/injected';

// const customNodeOptions = {
//   rpcUrl: polygonMumbai.rpcUrls.default as unknown as string, // Polygon RPC URL
//   chainId: polygonMumbai.id, // Polygon chain id
// };

// Magic Connect integration
const magicConnector = new MagicConnectConnector({
  options: {
    apiKey: 'pk_live_97CD53269B986DB0', //required
    //...Other options
  },
});

const metamaskConnector = new InjectedConnector();

const { chains, publicClient } = configureChains([polygonMumbai], [publicProvider()]);

// Wagmi client
const config = createConfig({
  autoConnect: true,
  // publicClient: createPublicClient({
  //   chain: polygonMumbai,
  //   transport: http(),
  // }),
  publicClient: publicClient,
  connectors: [magicConnector,
      metamaskConnector
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  // const connect = async () => {
  //   const magic = new Magic('pk_live_78EA8AA09E13625B', {
  //     network: customNodeOptions,
  //   });
  //   const accounts = await magic.wallet.connectWithUI();
  //   console.log(accounts);
  // };

  // useEffect(() => {
  //   connect();
  // }, []);

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <DefaultSeo />
      <ToastContainer position='bottom-right' />
      <WagmiConfig config={config}>
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
      </WagmiConfig>
    </>
  );
}

export default MyApp;
