import { DecodedMessage } from '@xmtp/xmtp-js';
import { shortAddress } from '../utils/messaging';
import TalentLayerContext from '../context/talentLayer';
import { useContext } from 'react';
// import { shortAddress } from '../utils/utils';

interface IMessageCardProps {
  message: DecodedMessage;
}

const MessageCard = ({ message }: IMessageCardProps) => {
  const { account, user } = useContext(TalentLayerContext);
  const isSender = message.senderAddress.toLowerCase() === user?.address.toLowerCase();
  console.log('isSender', isSender);
  console.log('message.SenderADDRESS', message.senderAddress);
  console.log('user.address', user?.address);

  return (
    <>
      <div className={`flex ${isSender ? 'justify-start' : 'justify-end'} mb-4`}>
        <div
          className={`mr-2 py-3 px-4 ${
            isSender
              ? 'bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
              : 'bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
          } text-white`}>
          <div>
            <b>{shortAddress(message.senderAddress)}</b>
          </div>
          <div>{message.content}</div>
        </div>
      </div>
    </>
  );
};

export default MessageCard;
