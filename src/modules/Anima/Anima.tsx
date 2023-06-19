import '@anima-protocol/personhood-sdk-react/style.css';
import { Personhood } from '@anima-protocol/personhood-sdk-react';
import { useSignMessage, useAccount } from 'wagmi';
import { useCallback, useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';

export default function Anima(): JSX.Element {
  const { account, user } = useContext(TalentLayerContext);
  console.log('address', user?.address);

  const { signMessageAsync } = useSignMessage();

  const shared = useCallback((e: { state: string }) => {
    console.log('shared', e);
  }, []);

  return process.env.NEXT_PUBLIC_ACTIVE_ANIMA === 'true' && account?.isConnected ? (
    <div>
      <p className='text-sm text-gray-500 mt-4'>
        <strong>
          Proof of{' '}
          <a target='_blank' rel='noreferrer' className='text-blue-500' href='https://anima.io/'>
            Personhood
          </a>{' '}
        </strong>
      </p>

      {user?.address && account?.isConnected === true && (
        <div className='mt-4 w-1/2 sm:w-1/4'>
          <Personhood
            onFinish={shared}
            sessionId={process.env.NEXT_PUBLIC_ANIMA_SESSION_ID || ''}
            signCallback={(payload: any) => signMessageAsync({ message: payload })}
            walletAddress={user?.address}
          />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

// import '@anima-protocol/personhood-sdk-react/style.css';
// import { Personhood } from '@anima-protocol/personhood-sdk-react';
// import { useSignMessage, useAccount } from 'wagmi';
// import { useCallback, useContext, useState, useEffect } from 'react';
// import TalentLayerContext from '../../context/talentLayer';
// import useUserById from '../../hooks/useUserById';
// import { IUser } from '../../types';

// export default function Anima({ userId }: { userId: any }): JSX.Element {
//   const { account } = useContext(TalentLayerContext);
//   const userAddress = userId ? useUserById(userId)?.address : null;
//   console.log('userAddress', userAddress);
//   console.log('userId', userId);

//   const [isPersonhood, setIsPersonhood] = useState(false);
//   console.log('isPersonhood', isPersonhood);

//   const { signMessageAsync } = useSignMessage();
//   const shared = useCallback((e: { state: string }) => {
//     console.log('shared', e);

//     if (e.state === 'APPROVED') {
//       setIsPersonhood(true);
//     }
//   }, []);

//   return process.env.NEXT_PUBLIC_ACTIVE_ANIMA === 'true' && account?.isConnected ? (
//     <div>
//       <p className='text-sm text-gray-500 mt-4'>
//         <strong>
//           Proof of{' '}
//           <a target='_blank' rel='noreferrer' className='text-blue-500' href='https://anima.io/'>
//             Personhood
//           </a>{' '}
//         </strong>
//       </p>
//       <div className='mt-4 w-1/2 sm:w-1/4'>
//         <Personhood
//           onFinish={shared}
//           sessionId={process.env.NEXT_PUBLIC_ANIMA_SESSION_ID || ''}
//           signCallback={(payload: any) => signMessageAsync({ message: payload })}
//           walletAddress={userAddress}
//         />
//       </div>
//     </div>
//   ) : (
//     <></>
//   );
// }
