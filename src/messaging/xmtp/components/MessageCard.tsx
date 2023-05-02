import TalentLayerContext from '../../../context/talentLayer';
import { useContext } from 'react';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { formatDateDivider } from '../../../utils/dates';
import { formatDateTime } from '../utils/messaging';
import { ChatMessageStatus, XmtpChatMessage } from '../../../types';
import Loading from '../../../components/Loading';
import Image from 'next/image';

interface IMessageCardProps {
  message: XmtpChatMessage;
  dateHasChanged: boolean;
}

const MessageCard = ({ message, dateHasChanged }: IMessageCardProps) => {
  const { user } = useContext(TalentLayerContext);
  const userSending = useUserByAddress(message.from);

  const isSender = message.from.toLowerCase() === user?.address.toLowerCase();

  return (
    <>
      {dateHasChanged && userSending?.handle && <DateDivider date={message.timestamp} />}
      {userSending?.handle && (
        <div
          className={`flex ${isSender ? 'justify-end pr-5' : 'justify-start'} mb-4 items-center`}>
          {isSender && user && (
            <>
              <span className='text-sm pr-3 text-gray-400'>
                {formatDateTime(message.timestamp)}
              </span>
              <Image
                src={`/images/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
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
            {isSender && message.status === ChatMessageStatus.SENT && (
              <>
                <div>{userSending && userSending.handle && <b>{userSending.handle}</b>}</div>
                <div>{message.messageContent}</div>
              </>
            )}
            {isSender && message.status === ChatMessageStatus.PENDING && (
              <div className='flex flex-row items-center'>
                <div>
                  <div>{userSending && userSending.handle && <b>{userSending.handle}</b>}</div>
                  <div>{message.messageContent}</div>
                </div>
                <div className='ml-2'>
                  <Loading size={'5'} />
                </div>
              </div>
            )}
            {isSender && message.status === ChatMessageStatus.ERROR && (
              <>
                <div>{userSending && userSending.handle && <b>{userSending.handle}</b>}</div>
                <div>{message.messageContent}</div>
              </>
            )}
            {!isSender && (
              <>
                <div>{userSending && userSending.handle && <b>{userSending.handle}</b>}</div>
                <div>{message.messageContent}</div>
              </>
            )}
          </div>
          {!isSender && (
            <>
              <Image
                src={`/images/default-avatar-${Number(userSending?.id) % 11}.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                alt=''
              />
              <span className='text-sm pl-3 text-gray-400'>
                {formatDateTime(message.timestamp)}
              </span>
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
