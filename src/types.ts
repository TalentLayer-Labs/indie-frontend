import { BigNumber } from 'ethers';
import { Connector } from 'wagmi';

export type IUser = {
  id: string;
  handle: string;
  address: string;
  rating: string;
  description?: IUserDetails;
  userStat: IUserStat;
  delegates?: string[];
  referralGains?: IReferralGain[];
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

export type IUserStat = {
  numReceivedReviews: number;
  numGivenReviews: number;
  numCreatedServices: number;
  numFinishedServicesAsBuyer: number;
  numCreatedProposals: number;
  numFinishedServicesAsSeller: number;
  numReferredUsers: number;
  numReferredUsersReviewsReceived: number;
  averageReferredRating: number;
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
  sender: IUser;
  receiver: IUser;
  token: IToken;
  status: TransactionStatusEnum;
  senderFee: number;
  receiverFee: number;
  lastInteraction: number;
  senderFeePaidAt: number;
  receiverFeePaidAt: number;
  arbitrationFeeTimeout: number;
  amount: number;
  disputeId: number;
  arbitrator: string;
  // arbitrator: `0x${string}`;
  ruling: number;
  evidences: IEvidence[];
};

export enum TransactionStatusEnum {
  NoDispute = 'NoDispute',
  WaitingSender = 'WaitingSender',
  WaitingReceiver = 'WaitingReceiver',
  DisputeCreated = 'DisputeCreated',
  Resolved = 'Resolved',
}

export type IService = {
  id: string;
  status: ServiceStatusEnum;
  rateToken: IToken;
  referralAmount?: string;
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
  arbitrator: `0x${string}`;
  arbitratorExtraData: string;
  arbitrationFeeTimeout: number;
};

export type IKeyword = {
  id: string;
};

export type IServiceDetails = {
  id: string;
  title?: string;
  about?: string;
  keywords: IKeyword[];
  rateAmount?: string;
  rateToken?: string;
  keywords_raw?: string;
  startDate?: string;
  expectedEndDate?: string;
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
  referrer: IUser;
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
};

export type IUserGain = {
  id: string;
  user: IUser;
  token: IToken;
  totalGain: string;
};

export type IEvidence = {
  id: string;
  transaction: ITransaction;
  createdAt: string;
  party: IUser;
  cid: string;
  description?: IEvidenceDetails;
};

export type IEvidenceDetails = {
  name: string;
  fileTypeExtension: string;
  description: string;
  fileHash: string;
};

export type IReferralGain = {
  id: string;
  user: IUser;
  token: IToken;
  service: IService;
  totalGain: string;
  availableBalance: string;
};
