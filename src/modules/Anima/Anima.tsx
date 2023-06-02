import '@anima-protocol/personhood-sdk-react/style.css';
import { Personhood } from '@anima-protocol/personhood-sdk-react';
import { useSignMessage, useAccount } from 'wagmi';
import { useCallback } from 'react';

export default function Example(): JSX.Element {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const shared = useCallback((e: { info: string }) => {
    console.log('shared', e.info);
  }, []);

  const sign = useCallback(
    async (payload: string | object) => {
      const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const signature = await signMessageAsync({ message });
      return `0x${signature}`;
    },
    [signMessageAsync],
  );

  return (
    <div>
      {address && (
        <Personhood
          onFinish={shared}
          sessionId='4985c48e-7766-4e3b-9c3c-ea7027fc227d'
          signCallback={sign}
          walletAddress={address}
        />
      )}
    </div>
  );
}

// // src/App.tsx

// import '@anima-protocol/personhood-sdk-react/style.css';
// import { Personhood } from '@anima-protocol/personhood-sdk-react';
// import { ethers } from 'ethers';
// import { useCallback, useContext, useEffect, useState } from 'react';
// import { useProvider, useSigner } from 'wagmi';
// import TalentLayerContext from '../../context/talentLayer';

// export default function Anima(): JSX.Element {
//   const address = process.env.NEXT_PUBLIC_ANIMA_ADDRESS as string;

//   const provider = useProvider({
//     chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
//   });

//   const { data: signer } = useSigner({
//     chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
//   });

//   const sign = useCallback(
//     (payload: string | object) => {
//       const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
//       return signer?.signMessage(message);
//     },
//     [signer],
//   );

//   const shared = useCallback((e: { info: string }) => {
//     console.log('shared', e.info);
//   }, []);

//   return (
//     <div>
//       <button>Connect Wallet</button>
//       {address && signer && (
//         <Personhood
//           onFinish={shared}
//           sessionId='4985c48e-7766-4e3b-9c3c-ea7027fc227d'
//           signCallback={sign}
//           walletAddress={address}
//         />
//       )}
//     </div>
//   );
// }
