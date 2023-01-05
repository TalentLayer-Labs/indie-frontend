import { shortAddress, truncate } from '../utils/messaging';
import useUserByAddress from '../../hooks/useUserByAddress';
import { useNavigate } from 'react-router-dom';
import { ConversationDisplayType } from '../../types';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { CheckCircle } from 'heroicons-react';
import { formatDateConversationCard } from '../../utils/dates';

interface IConversationCardProps {
  address: string;
  latestMessage?: string;
  latestMessageTimestamp?: number;
  peerAddress: string;
  conversationDisplayType: string;
  selectedConversationPeerAddress: string;
}

const ConversationCard = ({
  peerAddress,
  latestMessage,
  latestMessageTimestamp,
  address,
  conversationDisplayType,
  selectedConversationPeerAddress,
}: IConversationCardProps) => {
  const user = useUserByAddress(pCAIP10ToWallet(peerAddress));
  const navigate = useNavigate();
  const isConvSelected = pCAIP10ToWallet(peerAddress) === selectedConversationPeerAddress;

  const approveRequest = () => {
    const approve = async () => {
      await chatApi.approve({ account: address, senderAddress: peerAddress });
      navigate(
        `/messaging/${ConversationDisplayType.CONVERSATION}/${pCAIP10ToWallet(peerAddress)}`,
      );
    };
    if (peerAddress) {
      try {
        approve();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelectConversation = () => {
    navigate(`/messaging/${conversationDisplayType}/${pCAIP10ToWallet(peerAddress)}`);
  };

  //TODO: Add a check on "user && user.id" for avatar & "user && user.name" for handle, if we want to display a loader (limited to only TL profiles)
  return conversationDisplayType === ConversationDisplayType.REQUEST ? (
    <div className={`flex justify-start py-4 px-2 justify-center items-center border-b-2`}>
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
              className='h-12 w-12 text-indigo-500 cursor-pointer'
              onClick={approveRequest}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => handleSelectConversation()}
      className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 cursor-pointer ${
        isConvSelected ? 'bg-gray-200 ' : 'border-b-2'
        // isConvSelected ? 'bg-gray-200 border border-gray-500/75' : 'border-b-2'
      }
      `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-1/2'>
        {user && user.handle ? <b>{user.handle}</b> : <b>{shortAddress(peerAddress)}</b>}
        <p className='text-s font-medium text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap'>
          {latestMessage && truncate(latestMessage, 75)}
        </p>
      </div>
      <div className='basis-1/4'>
        <span className='text-sm pl-3 text-gray-400 bas'>
          {formatDateConversationCard(latestMessageTimestamp)}
        </span>
      </div>
    </div>
  );
};

export default ConversationCard;
