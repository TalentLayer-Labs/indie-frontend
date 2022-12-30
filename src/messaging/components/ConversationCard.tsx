import { shortAddress, truncate } from '../utils/messaging';
import useUserByAddress from '../../hooks/useUserByAddress';
import { useNavigate } from 'react-router-dom';
import { ConversationDisplayType } from '../../types';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { CheckCircle } from 'heroicons-react';

interface IConversationCardProps {
  address: string;
  latestMessage?: string;
  peerAddress: string;
  conversationDisplayType: ConversationDisplayType;
}

const ConversationCard = ({
  peerAddress,
  latestMessage,
  address,
  conversationDisplayType,
}: IConversationCardProps) => {
  const user = useUserByAddress(pCAIP10ToWallet(peerAddress));
  const navigate = useNavigate();

  const approveRequest = () => {
    const approve = async () => {
      await chatApi.approve({ account: address, senderAddress: peerAddress });
    };
    if (peerAddress) {
      try {
        approve();
        navigate(
          `/messaging/${ConversationDisplayType.CONVERSATION}/${pCAIP10ToWallet(peerAddress)}`,
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Display or not non TL profiles
  // if (!user?.id) return;

  // const isActiveConversation = () => return key === address;

  const handleSelectConversation = () => {
    navigate(`/messaging/${conversationDisplayType}/${pCAIP10ToWallet(peerAddress)}`);
  };

  //${isConvSelected ? 'border-indigo-500 border-2' : 'border-b-2'}

  return conversationDisplayType === ConversationDisplayType.REQUEST ? (
    <div className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-full'>
        <div className='flex items-center'>
          <div className='basis-3/4'>
            {user && user.handle ? (
              <b>{user.handle}</b>
            ) : (
              <b>{shortAddress(pCAIP10ToWallet(peerAddress))}</b>
            )}
            <p className='text-s font-medium text-gray-500'>
              {latestMessage && truncate(latestMessage, 75)}
            </p>
          </div>
          <div className='basis-1/4'>
            <CheckCircle
              className='h-12 w-12 text-green-500 cursor-pointer'
              onClick={approveRequest}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => handleSelectConversation()}
      // onClick={() => setSelectedConversationPeerAddress(address)}
      className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 cursor-pointer 
      `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-full'>
        {user && user.handle ? <b>{user.handle}</b> : <b>{shortAddress(peerAddress)}</b>}
        <p className='text-s font-medium text-gray-500'>
          {latestMessage && truncate(latestMessage, 75)}
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;
