import { formatTimestampTime } from '../utils/messaging';
import TalentLayerContext from '../../../context/talentLayer';
import { useContext } from 'react';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { formatTimestampDivider } from '../../../utils/dates';
import { PushChatMessage, ChatMessageStatus } from '../../../types';

interface IMessageCardProps {
  message: PushChatMessage;
  dateHasChanged: boolean;
}

const MessageCard = ({ message, dateHasChanged }: IMessageCardProps) => {
  const { user } = useContext(TalentLayerContext);
  const senderAddress = pCAIP10ToWallet(message.from);
  const peerUser = useUserByAddress(senderAddress);

  const isSender = senderAddress.toLowerCase() === user?.address.toLowerCase();

  return (
    <>
      {dateHasChanged && peerUser?.handle && <DateDivider timestamp={message.timestamp} />}
      {peerUser?.handle && (
        <div
          className={`flex ${isSender ? 'justify-end pr-5' : 'justify-start'} mb-4 items-center`}>
          {isSender && user && (
            <>
              <span className='text-sm pr-3 text-gray-400'>
                {formatTimestampTime(message.timestamp)}
              </span>
              <img
                src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                alt=''
              />
            </>
          )}
          <div
            className={`py-3 px-4 ${
              isSender && message.status === ChatMessageStatus.SENT
                ? 'ml-2 bg-indigo-500 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : isSender && message.status === ChatMessageStatus.ERROR
                ? 'ml-2 bg-red-600 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : isSender && message.status === ChatMessageStatus.PENDING
                ? 'ml-2 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : 'mr-2 bg-gray-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
            }
          text-white`}>
            <div>{peerUser && peerUser.handle && <b>{peerUser.handle}</b>}</div>
            <div>{message.messageContent}</div>
          </div>
          {!isSender && (
            <>
              <img
                src={`/default-avatar-${Number(peerUser?.id) % 11}.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                alt=''
              />
              <span className='text-sm pl-3 text-gray-400'>
                {formatTimestampTime(message.timestamp)}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

const DateDivider = ({ timestamp }: { timestamp?: number }): JSX.Element => (
  <div className='flex align-items-center items-center pb-8 pt-4'>
    <div className='grow h-0.5 bg-gray-300/25' />
    <span className='mx-11 flex-none text-gray-300 text-sm font-semibold'>
      {formatTimestampDivider(timestamp)}
    </span>
    <div className='grow h-0.5 bg-gray-300/25' />
  </div>
);

export default MessageCard;
