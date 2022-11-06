export type User = {
  id: string;
  handle: string;
  address: string;
  uri: string;
  withPoh: boolean;
  rating: string;
  numReviews: string;
};

export type Account = {
  address: string;
  isConnected: boolean | undefined;
  isReconnecting: boolean | undefined;
  isConnecting: boolean | undefined;
  isDisconnected: boolean | undefined;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected' | undefined;
};

export type Service = {
  id: string;
  status: string;
  buyer: User;
  seller: User;
  sender: User;
  recipient: User;
  uri: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceDetails = {
  title: string;
  about: string;
  keywords: string;
  recipient: string;
  role: string;
  rateAmount: string;
  rateToken: string;
};

export type ServiceDetailsBuyer = {
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

export type Review = {
  id: string;
  service: Service;
  to: User;
  uri: string;
};

export type ReviewDetails = {
  content: string;
  rating: string;
};

export enum ServiceStatus {
  Filled = 'Filled',
  Confirmed = 'Confirmed',
  Finished = 'Finished',
  Rejected = 'Rejected',
  Opened = 'Opened',
}

export enum ProposalStatus {
  Pending = 'Pending',
  Validated = 'Validated',
  Rejected = 'Rejected',
}
export type ProposalDetails = {
  sellerId: string;
  uri: string;
  proposalTitle: string;
  proposalAbout: string;
  rateType: string;
  expectedHour: string;
  rateToken: string;
  rateAmount: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
};

export type Proposal = {
  id: string;
  uri: string;
  status: ProposalStatus;
  seller: User;
  rateToken: string;
  rateAmount: string;
  service: Service;
  createdAt: string;
  updatedAt: string;
};

export enum ProposalType {
  Hourly = 1,
  Flat,
  Milestone,
}

export enum ProfileType {
  Buyer = 1,
  Seller,
}

export type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export type TokenFormattedValues = {
  roundedValue: string;
  exactValue: string;
};
