import { BigNumber } from 'ethers';
import { Connector } from 'wagmi';

export type IUser = {
  id: string;
  handle: string;
  address: string;
  rating: string;
  numReviews: string;
  description?: IUserDetails;
};

export type IUserDetails = {
  title: string;
  name: string;
  role: string;
  image_url: string;
  video_url?: string;
  about: string;
  skills_raw: string;
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
  cid: string;
  createdAt: string;
  updatedAt: string;
  transaction: ITransaction;
  platform: IPlatform;
  proposals: IProposal[];
  validatedProposal: IProposal[];
  description?: IServiceDetails;
};

export type IPlatform = {
  id: string;
  name: string;
  originServiceFeeRate: number;
  originValidatedProposalFeeRate: number;
  proposalPostingFee: string;
  servicePostingFee: string;
};

export type IKeyword = {
  id: string;
};

export type IServiceDetails = {
  title: string;
  about: string;
  keywords: IKeyword[];
  rateAmount: string;
  rateToken: string;
  id: string;
  keywords_raw: string;
  startDate: string;
  expectedEndDate: string;
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
  rating: number;
  createdAt: string;
  description?: IReviewDetails;
};

export type IReviewDetails = {
  id: string;
  content: string;
};

export enum ServiceStatusEnum {
  Opened = 'Opened',
  Confirmed = 'Confirmed',
  Finished = 'Finished',
  Cancelled = 'Cancelled',
  Uncompleted = 'Uncompleted',
}

export enum ProposalStatusEnum {
  Pending = 'Pending',
  Validated = 'Validated',
  Rejected = 'Rejected',
}

export type IProposalDetails = {
  id: string;
  title: string;
  about: string;
  startDate: string;
  expectedHours: string;
  service: IService;
  expirationDate: string;
  video_url: string;
};

export type IProposal = {
  id: string;
  cid: string;
  status: ProposalStatusEnum;
  seller: IUser;
  rateToken: IToken;
  rateAmount: string;
  service: IService;
  // transaction: ITransaction;
  platform: IPlatform;
  createdAt: string;
  updatedAt: string;
  description?: IProposalDetails;
  expirationDate: string;
};

export type IFees = {
  protocolEscrowFeeRate: number;
  originServiceFeeRate: number;
  originValidatedProposalFeeRate: number;
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
  MUMBAI = 80001,
}

export type IToken = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  minimumTransactionAmount?: BigNumber;
};

export type ITokenFormattedValues = {
  roundedValue: string;
  exactValue: string;
};

export type IPayment = {
  createdAt: number;
  id: string;
  amount: string;
  rateToken: IToken;
  paymentType: PaymentTypeEnum;
  transactionHash: string;
  service: IService;
  createdAt: string;
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
