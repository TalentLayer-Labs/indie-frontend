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
  transaction {
    id
  }
  buyer {
    id
    handle
    address
    rating
    userStats {
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
  validatedProposal: proposals(where: {status: "Validated"}){
    id,
    rateToken {
      address
      decimals
      name
      symbol
    },
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
  rateToken
  keywords_raw
  keywords {
    id
  }
`;

// **********************  OPTION 1-  we apply each case of filtering with AND & OR **********************
const getFilteredServiceCondition = (params: IProps) => {
  let condition = 'where: {';

  if (params.serviceStatus) condition += `status: "${params.serviceStatus}",`;
  if (params.buyerId) condition += `buyer: "${params.buyerId}",`;
  if (params.sellerId) condition += `seller: "${params.sellerId}",`;
  if (params.platformId) condition += `platform: "${params.platformId}",`;

  let keywordConditions = '';

  // Filter by keyword
  if (params.keywordList && params.keywordList.length > 0) {
    keywordConditions = params.keywordList
      .map(keyword => `{keywords_raw_contains: "${keyword}"}`)
      .join(', ');
  }

  // Prepare description_ filter
  let descriptionCondition = '';
  if (params.searchQuery) {
    descriptionCondition += `{keywords_raw_contains: "${params.searchQuery}"}`;
  }
  if (keywordConditions) {
    descriptionCondition = descriptionCondition
      ? `{ and: [ { or: [${keywordConditions}]}, ${descriptionCondition} ] }`
      : `{ or: [${keywordConditions}]}`;
  }

  if (descriptionCondition) {
    condition += `description_: ${descriptionCondition},`;
  }

  condition += '}';

  return condition === 'where: {}' ? '' : `, ${condition}`;
};

// **********************  OPTION 2 - We check if the searchQuery is in the keywordList then replace the keyword filter by the searchQuery **********************
// const getFilteredServiceCondition = (params: IProps) => {
//   let condition = 'where: {';

//   if (params.serviceStatus) condition += `status: "${params.serviceStatus}",`;
//   if (params.buyerId) condition += `buyer: "${params.buyerId}",`;
//   if (params.sellerId) condition += `seller: "${params.sellerId}",`;
//   if (params.platformId) condition += `platform: "${params.platformId}",`;

//   let keywordConditions: string[] = [];

//   // If searchQuery exists, it becomes the only keyword. Else, use keywords from keywordList.
//   if (params.searchQuery) {
//    need to check if the searchQuery is in the keywordList
//     keywordConditions = [`{keywords_raw_contains: "${params.searchQuery}"}`];
//   } else if (params.keywordList && params.keywordList.length > 0) {
//     keywordConditions = params.keywordList.map(keyword => `{keywords_raw_contains: "${keyword}"}`);
//   }

//   // Add keywordConditions to condition
//   if (keywordConditions.length > 0) {
//     condition += `description_: { or: [${keywordConditions.join(', ')}]},`;
//   }

//   condition += '}';
//   return condition === 'where: {}' ? '' : `, ${condition}`;
// };

// **********************  0 - initial query  **********************
// const getFilteredServiceCondition = (params: IProps) => {
//   let condition = 'where: {';

//   if (params.serviceStatus) condition += `status: "${params.serviceStatus}",`;
//   if (params.buyerId) condition += `buyer: "${params.buyerId}",`;
//   if (params.sellerId) condition += `seller: "${params.sellerId}",`;
//   if (params.platformId) condition += `platform: "${params.platformId}",`;

//   if (params.keywordList && params.keywordList.length > 0) {
//     let keywordConditions = params.keywordList.map(
//       keyword => `{keywords_raw_contains: "${keyword}"}`,
//     );
//     condition += `description_: { or: [${keywordConditions.join(', ')}]},`;
//   }

//   console.log('params.searchQuery', params.searchQuery);

//   // Add a searchQuery filter
//   if (params.searchQuery) {
//     condition += `description_: { or: [{keywords_raw_contains: "${params.searchQuery}"}]},`;
//   }

//   condition += '}';

//   return condition === 'where: {}' ? '' : `, ${condition}`;
// };

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
