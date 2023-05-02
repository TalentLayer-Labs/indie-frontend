import { DecodedMessage } from '@xmtp/xmtp-js';
import { ChatMessageStatus, XmtpChatMessage } from './types';

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

export const getLatestMessage = (messages: XmtpChatMessage[]): XmtpChatMessage =>
  messages[messages.length - 1];

export const CONVERSATION_PREFIX = 'talentLayer/dmV5';
export const buildConversationId = (talentLayerId1: string, talentLayerId2: string) => {
  const profileIdAParsed = parseInt(talentLayerId1, 16);
  const profileIdBParsed = parseInt(talentLayerId2, 16);

  return profileIdAParsed < profileIdBParsed
    ? `${CONVERSATION_PREFIX}/${talentLayerId1}-${talentLayerId2}`
    : `${CONVERSATION_PREFIX}/${talentLayerId2}-${talentLayerId1}`;
};

export const formatDateTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

export const isDateOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString();
};

export const buildChatMessage = (xmtpMessage: DecodedMessage): XmtpChatMessage => {
  return {
    from: xmtpMessage.senderAddress,
    to: xmtpMessage.conversation.peerAddress ? xmtpMessage.conversation.peerAddress : '',
    messageContent: xmtpMessage.content,
    timestamp: xmtpMessage.sent,
    status: ChatMessageStatus.SENT,
  };
};
