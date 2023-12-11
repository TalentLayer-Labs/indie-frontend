import { ServiceStatusEnum } from '../types';
import { processRequest } from '../utils/graphql';

interface IProps {
  serviceStatus?: ServiceStatusEnum;
  buyerId?: string;
  sellerId?: string;
  numberPerPage?: number;
  offset?: number;
  searchQuery?: string;
  platformId?: string;
  keywordList?: string[];
}

const serviceQueryFields = `
  id
  status
  createdAt
  cid
  referralAmount
  rateToken {
    name
    symbol
    address
    decimals
  }
  transaction {
    id
    status
  }
  buyer {
    id
    handle
    address
    rating
    userStat {
      numReceivedReviews
    }
  }
  seller {
    id
    handle
  }
  proposals {
    id
  }
  platform {
    name
    arbitrator
    arbitratorExtraData
    arbitrationFeeTimeout
  },
  validatedProposal: proposals(where: {status: "Validated"}){
    id,
    rateAmount,
  }
`;

const serviceDescriptionQueryFields = `
  id
  title
  video_url
  about
  startDate
  expectedEndDate
  rateAmount
  keywords_raw
  keywords {
    id
  }
`;

// **********************  Both query & optional filters are combined with AND & OR **********************
const getFilteredServiceCondition = (params: IProps) => {
  let condition = 'where: {';

  if (params.serviceStatus) condition += `status: "${params.serviceStatus}",`;
  if (params.buyerId) condition += `buyer: "${params.buyerId}",`;
  if (params.sellerId) condition += `seller: "${params.sellerId}",`;
  if (params.platformId) condition += `platform: "${params.platformId}",`;

  let keywordFilter = '';

  // Filter by keyword
  // This code filters the list of keywords to only those that are included in the keyword list.

  if (params.keywordList && params.keywordList.length > 0) {
    keywordFilter = params.keywordList
      .map(keyword => `{keywords_raw_contains: "${keyword}"}`)
      .join(', ');
  }

  // Prepare description_ filter
  let descriptionCondition = '';
  if (params.searchQuery) {
    descriptionCondition += `{keywords_raw_contains: "${params.searchQuery}"}`;
  }
  if (keywordFilter) {
    descriptionCondition = descriptionCondition
      ? `{ and: [ { or: [${keywordFilter}]}, ${descriptionCondition} ] }`
      : `{ or: [${keywordFilter}]}`;
  }

  if (descriptionCondition) {
    condition += `description_: ${descriptionCondition},`;
  }

  condition += '}';

  return condition === 'where: {}' ? '' : `, ${condition}`;
};

const getFilteredServiceDescriptionCondition = (params: IProps) => {
  let condition = ', where: {';
  condition += params.serviceStatus ? `service_: {status:"${params.serviceStatus}"}` : '';
  condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
  condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
  condition += params.platformId ? `, platform: "${params.platformId}"` : '';
  condition += '}';
  return condition === ', where: {}' ? '' : condition;
};

export const getServices = (params: IProps): Promise<any> => {
  const pagination = params.numberPerPage
    ? 'first: ' + params.numberPerPage + ', skip: ' + params.offset
    : '';
  const query = `
    {
      services(orderBy: id, orderDirection: desc ${pagination} ${getFilteredServiceCondition(
    params,
  )}) {
        ${serviceQueryFields}
        description {
          ${serviceDescriptionQueryFields}
        }
      }
    }`;

  return processRequest(query);
};

export const searchServices = (params: IProps): Promise<any> => {
  const pagination = params.numberPerPage
    ? 'first: ' + params.numberPerPage + ' skip: ' + params.offset
    : '';
  const query = `
    {
      serviceDescriptionSearchRank(
        text: "${params.searchQuery}",
        orderBy: id orderDirection: desc ${pagination} ${getFilteredServiceDescriptionCondition(
    params,
  )}
      ){
        ${serviceDescriptionQueryFields}
        service {
          ${serviceQueryFields}
        }
      }
    }`;
  return processRequest(query);
};

export const getServiceById = (id: string): Promise<any> => {
  const query = `
    {
      service(id: "${id}") {
        ${serviceQueryFields}
        description {
          ${serviceDescriptionQueryFields}
        }
      }
    }
    `;
  return processRequest(query);
};
