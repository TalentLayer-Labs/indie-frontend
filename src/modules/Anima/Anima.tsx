import '@anima-protocol/personhood-sdk-react/style.css';
import { Personhood } from '@anima-protocol/personhood-sdk-react';
import { useSignMessage, useAccount } from 'wagmi';
import { useCallback } from 'react';

export default function Anima(): JSX.Element {
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
