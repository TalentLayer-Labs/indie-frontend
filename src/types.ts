import { Connector } from 'wagmi';

export type IUser = {
  id: string;
  handle: string;
  address: string;
  withPoh: boolean;
  rating: string;
  numReviews: string;
  description: IUserDescription;
};

export type IUserDescription = {
  title: string;
  about: string;
  skills: ISkill[];
  skills_raw: string;
};

export type ISkill = {
  id: string;
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
  proposals: IProposal[];
  description: IServiceDescription;
};

export type IKeyword = {
  id: string;
};

export type IServiceDescription = {
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

export type IReview = {
  id: string;
  service: IService;
  to: IUser;
  uri: string;
  rating: number;
  createdAt: string;
  description: IReviewDescription;
};

export type IReviewDescription = {
  id: string;
  content: string;
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

export type IProposalDescription = {
  id: string;
  title: string;
  about: string;
  startDate: string;
  expectedHours: string;
  service: IService;
};

export type IProposal = {
  id: string;
  cid: string;
  status: ProposalStatusEnum;
  seller: IUser;
  rateToken: IToken;
  rateAmount: string;
  service: IService;
  createdAt: string;
  updatedAt: string;
  description: IProposalDescription;
};

export type IFees = {
  protocolEscrowFeeRate: number;
  originPlatformEscrowFeeRate: number;
  platformFeeRate: number;
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
