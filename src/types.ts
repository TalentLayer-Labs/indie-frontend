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
  address: string;
  isConnected: boolean | undefined;
  isReconnecting: boolean | undefined;
  isConnecting: boolean | undefined;
  isDisconnected: boolean | undefined;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected' | undefined;
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
  transactionId: string;
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
  rateToken: `0x${string}`;
  rateAmount: string;
  service: IService;
  createdAt: string;
  updatedAt: string;
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
}

export type IToken = {
  name: string;
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
  rateToken: string;
  paymentType: PaymentTypeEnum;
  transactionHash: string;
  service: IService;
};
