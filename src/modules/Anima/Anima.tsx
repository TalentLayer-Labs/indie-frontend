// import '@anima-protocol/personhood-sdk-react/style.css';
// import { Personhood } from '@anima-protocol/personhood-sdk-react';
// import { useSignMessage, useAccount } from 'wagmi';
// import { useCallback } from 'react';

// export default function Anima(): JSX.Element {
//   const { address } = useAccount();
//   const { signMessageAsync } = useSignMessage();

//   const shared = useCallback((e: { info: string }) => {
//     console.log('shared', e.info);
//   }, []);

//   const sign = useCallback(
//     async (payload: string | object) => {
//       const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
//       const signature = await signMessageAsync({ message });
//       return `0x${signature}`;
//     },
//     [signMessageAsync],
//   );

//   return (
//     <div>
//       {address && (
//         <Personhood
//           onFinish={shared}
//           sessionId='ab680896-bd53-420e-acfa-a90581dee418'
//           signCallback={sign}
//           walletAddress={address}
//         />
//       )}
//     </div>
//   );
// }

// src/App.tsx

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

  return (
    <div>
      {address && (
        <Personhood
          onFinish={shared}
          sessionId='ab680896-bd53-420e-acfa-a90581dee418'
          signCallback={(payload: string) => signMessageAsync({ message: payload })}
          walletAddress={address}
        />
      )}
    </div>
  );
}
