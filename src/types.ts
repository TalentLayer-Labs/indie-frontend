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
  platformId: number;
  proposals: IProposal[];
  validatedProposal: IProposal[];
  description?: IServiceDetails;
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
  id: string;
  title: string;
  about: string;
  startDate: string;
  expectedHours: string;
  service: IService;
  expirationDate: string;
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
  platformId: number;
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
  MUMBAI = 80001,
  POLYGON = 135,
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

export type IFeeClaim = {
  id: string;
  amount: string;
  createdAt: string;
  platform: IPlatform;
  token: IToken;
  transactionHash: string;
};

export type IFeePayments = {
  id: string;
  amount: string;
  createdAt: string;
  platform: IPlatform;
  service: IService;
  token: IToken;
  type: IFeeTypeEnum;
};

export enum IFeeTypeEnum {
  Platform = 'Platform',
  OriginPlatform = 'OriginPlatform',
}

export type IPlatform = {
  id: string;
  address: `0x${string}`;
  arbitrationFeeTimeout: string;
  arbitrator: `0x${string}`;
  arbitratorExtraData: `0x${string}`;
  createdAt: string;
  originServiceFeeRate: number;
  originValidatedProposalFeeRate: number;
  feeClaims: IFeeClaim[];
  feePayments: IFeePayments;
  name: string;
  totalPlatformGains: IPlatformGain;
  uri: string;
  description?: IPlatformDescription;
};

export type IPlatformDescription = {
  id: string;
  about: string;
  image_url: string;
  video_url: string;
  website: string;
};

export type IPlatformGain = {
  id: string;
  platform: IPlatform;
  token: IToken;
  totalPlatformFeeGain: string;
  totalOriginPlatformFeeGain: string;
};
