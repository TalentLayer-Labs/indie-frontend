import { DecodedMessage } from '@xmtp/xmtp-js';
import TalentLayerContext from '../../../context/talentLayer';
import { useContext } from 'react';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { formatDateDivider } from '../../../utils/dates';
import { formatDateTime } from '../utils/messaging';

interface IMessageCardProps {
  message: DecodedMessage;
  dateHasChanged: boolean;
}

const MessageCard = ({ message, dateHasChanged }: IMessageCardProps) => {
  const { user } = useContext(TalentLayerContext);
  const peerUser = useUserByAddress(message.senderAddress);

  const isSender = message.senderAddress.toLowerCase() === user?.address.toLowerCase();

  // let activeUser;
  // isSender ? (activeUser = user) : (activeUser = useUserByAddress(message.senderAddress));

  return (
    <>
      {dateHasChanged && peerUser?.handle && <DateDivider date={message.sent} />}
      {peerUser?.handle && (
        <div
          className={`flex ${isSender ? 'justify-end pr-5' : 'justify-start'} mb-4 items-center`}>
          {isSender && user && (
            <>
              <span className='text-sm pr-3 text-gray-400'>{formatDateTime(message.sent)}</span>
              <img
                src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                alt=''
              />
            </>
          )}
          <div
            className={`py-3 px-4 ${
              isSender
                ? 'ml-2 bg-indigo-500 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : 'mr-2 bg-gray-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
            } text-white`}>
            <div>
              <div>{peerUser && peerUser.handle && <b>{peerUser.handle}</b>}</div>
            </div>
            <div>{message.content}</div>
          </div>
          {!isSender && (
            <>
              <img
                src={`/default-avatar-${Number(peerUser?.id) % 11}.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                alt=''
              />
              <span className='text-sm pl-3 text-gray-400'>{formatDateTime(message.sent)}</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className='flex align-items-center items-center pb-8 pt-4'>
    <div className='grow h-0.5 bg-gray-300/25' />
    <span className='mx-11 flex-none text-gray-300 text-sm font-semibold'>
      {formatDateDivider(date)}
    </span>
    <div className='grow h-0.5 bg-gray-300/25' />
  </div>
);

export default MessageCard;
