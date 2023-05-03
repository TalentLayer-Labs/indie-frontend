export enum ConversationDisplayType {
  CONVERSATION = 'conversations',
  REQUEST = 'requests',
}

export type XmtpChatMessage = {
  from: string;
  to: string;
  messageContent: string;
  timestamp: Date;
  status: ChatMessageStatus;
};

export enum ChatMessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  ERROR = 'error',
}
