import { ethers } from 'ethers';
import { Connector } from 'wagmi';

export type IUser = {
  id: string;
  handle: string;
  address: string;
  uri: string;
  withPoh: boolean;
  rating: string;
  numReviews: string;
};

export type IUserDetails = {
  title: string;
  about: string;
  skills: string;
};

export type IAccount = {
  address?: `0x${string}`;
  connector?: Connector;
  isConnecting: boolean;
  isReconnecting: boolean;
  isConnected: boolean;
  isDisconnected: boolean;
  status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected';
};

// TODO: add the rest of the fields
export type ITransaction = {
  id: string;
};

export type IService = {
  id: string;
  status: ServiceStatusEnum;
  buyer: IUser;
  seller: IUser;
  sender: IUser;
  recipient: IUser;
  uri: string;
  createdAt: string;
  updatedAt: string;
  transaction: ITransaction;
  proposals: IProposal[];
  validatedProposal: IProposal[];
};

export type IServiceDetails = {
  title: string;
  about: string;
  keywords: string;
  recipient: string;
  role: string;
  rateAmount: string;
  rateToken: string;
};

export type IServiceDetailsBuyer = {
  title: string;
  about: string;
  rateAmount: string;
  rateToken: string;
  buyerHandle: string;
  buyerId: string;
  buyerServiceCount: string;
  buyerRating: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
};

export type IReview = {
  id: string;
  service: IService;
  to: IUser;
  uri: string;
};

export type IReviewDetails = {
  content: string;
  rating: string;
};

export enum ServiceStatusEnum {
  Filled = 'Filled',
  Confirmed = 'Confirmed',
  Finished = 'Finished',
  Rejected = 'Rejected',
  Opened = 'Opened',
}

export enum ProposalStatusEnum {
  Pending = 'Pending',
  Validated = 'Validated',
  Rejected = 'Rejected',
}

export type IProposalDetails = {
  description: string;
};

export type IProposal = {
  id: string;
  uri: string;
  status: ProposalStatusEnum;
  seller: IUser;
  rateToken: IToken;
  rateAmount: string;
  service: IService;
  createdAt: string;
  updatedAt: string;
};

export type IFees = {
  protocolFeeRate: ethers.BigNumber;
  originPlatformFeeRate: ethers.BigNumber;
  platformFeeRate: ethers.BigNumber;
};

export enum ProposalTypeEnum {
  Hourly = 1,
  Flat,
  Milestone,
}

export enum ProfileTypeEnum {
  Buyer = 1,
  Seller,
}

export enum PaymentTypeEnum {
  Release = 'Release',
  Reimburse = 'Reimburse',
}

export enum NetworkEnum {
  LOCAL = 1337,
  GOERLI = 5,
  FUJI = 43113,
}

export type IToken = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
};

export type ITokenFormattedValues = {
  roundedValue: string;
  exactValue: string;
};

export type IPayment = {
  id: string;
  amount: string;
  rateToken: IToken;
  paymentType: PaymentTypeEnum;
  transactionHash: string;
  service: IService;
};

export type IUserGain = {
  id: string;
  user: IUser;
  token: IToken;
  totalGain: string;
};

export enum ConversationDisplayType {
  CONVERSATION = 'conversations',
  REQUEST = 'requests',
}

export type PushChatMessage = {
  from: string;
  to: string;
  messageContent: string;
  timestamp: number;
  status: ChatMessageStatus;
};

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

export type PushMessage = {
  cid: string;
  encType: string;
  encryptedSecret: string;
  fromCAIP10: string;
  fromDID: string;
  link: string | null;
  messageContent: string;
  messageType: string;
  sigType: string;
  signature: string;
  timestamp?: number;
  toCAIP10: string;
  toDID: string;
};
