import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { ChatMessage, ChatMessageStatus, PushMessage } from '../../../types';

export const shortAddress = (addr: string) =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;

export const truncate = (str: string, length: number) => {
  if (!str) {
    return str;
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }
  return str;
};

export const formatTimestampTime = (timestamp: number | undefined): string =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

export const isTimestampOnSameDay = (
  timestamp1: number | undefined,
  timestamp2: number | undefined,
): boolean => {
  //TODO not sure what to do if no timestamp
  if (!timestamp1 || !timestamp2) return true;
  return new Date(timestamp1)?.toDateString() === new Date(timestamp2)?.toDateString();
};

export const buildChatMessage = (
  pushMessage: Message | IMessageIPFS | PushMessage,
): ChatMessage => {
  return {
    from: pushMessage.fromCAIP10,
    to: pushMessage.toCAIP10,
    messageContent: pushMessage.messageContent,
    timestamp: pushMessage.timestamp ? pushMessage.timestamp : 0,
    status: ChatMessageStatus.SENT,
  };
};

export const buildConversationMessage = (pushMessage: PushMessage): Message => {
  return {
    fromCAIP10: pushMessage.fromCAIP10,
    messageContent: pushMessage.messageContent,
    messageType: pushMessage.messageType,
    toCAIP10: pushMessage.toCAIP10,
    timestamp: pushMessage.timestamp ? pushMessage.timestamp : 0,
    link: pushMessage.link,
    fromDID: pushMessage.fromDID,
    toDID: pushMessage.toDID,
    encType: pushMessage.encType,
    signature: pushMessage.signature,
    sigType: pushMessage.sigType,
    encryptedSecret: pushMessage.encryptedSecret,
  };
};
