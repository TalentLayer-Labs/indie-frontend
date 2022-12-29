import { DecodedMessage } from '@xmtp/xmtp-js';
import { shortAddress } from '../utils/messaging';
import TalentLayerContext from '../../context/talentLayer';
import { useContext } from 'react';
import { getUserByAddress } from '../../queries/users';
import useUserByAddress from '../../hooks/useUserByAddress';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
// import { shortAddress } from '../utils/utils';

interface IMessageCardProps {
  message: IMessageIPFS;
}

const MessageCard = ({ message }: IMessageCardProps) => {
  const { user } = useContext(TalentLayerContext);
  const senderAddress = pCAIP10ToWallet(message.fromCAIP10);
  const peerUser = useUserByAddress(senderAddress);

  const isSender = senderAddress.toLowerCase() === user?.address.toLowerCase();

  // let activeUser;
  // isSender ? (activeUser = user) : (activeUser = useUserByAddress(message.senderAddress));

  return (
    <>
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
        {isSender && user && (
          <img
            src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
            className='object-cover h-12 w-12 rounded-full'
            alt=''
          />
        )}
        <div
          className={`py-3 px-4 ${
            isSender
              ? 'ml-2 bg-indigo-500 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
              : 'mr-2 bg-gray-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
          } text-white`}>
          <div>
            {peerUser && peerUser.handle ? (
              <b>{peerUser.handle}</b>
            ) : (
              <b>{shortAddress(senderAddress)}</b>
            )}
          </div>
          <div>{message.messageContent}</div>
        </div>
        {!isSender && (
          <img
            src={`/default-avatar-${Number(peerUser?.id ? peerUser.id : '1') % 11}.jpeg`}
            className='object-cover h-12 w-12 rounded-full'
            alt=''
          />
        )}
      </div>
    </>
  );
};

export default MessageCard;
