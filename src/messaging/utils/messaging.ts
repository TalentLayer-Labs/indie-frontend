import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { ChatMessage } from '../../types';

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

export const formatTime = (timestamp: number | undefined): string =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

export const isOnSameDay = (
  timestamp1: number | undefined,
  timestamp2: number | undefined,
): boolean => {
  //TODO not sure what to do if no timestamp
  if (!timestamp1 || !timestamp2) return true;
  return new Date(timestamp1)?.toDateString() === new Date(timestamp2)?.toDateString();
};

export const buildChatMessage = (pushMessage: Message | IMessageIPFS): ChatMessage => {
  return {
    from: pushMessage.fromCAIP10,
    to: pushMessage.toCAIP10,
    messageContent: pushMessage.messageContent,
    timestamp: pushMessage.timestamp ? pushMessage.timestamp : 0,
  };
};
