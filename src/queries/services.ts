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

const getFilteredServiceCondition = (params: IProps) => {
  let condition = 'where: {';

  if (params.serviceStatus) condition += `status: "${params.serviceStatus}",`;
  if (params.buyerId) condition += `buyer: "${params.buyerId}",`;
  if (params.sellerId) condition += `seller: "${params.sellerId}",`;
  if (params.platformId) condition += `platform: "${params.platformId}",`;

  // Filter by keyword
  if (params.keywordList && params.keywordList.length > 0) {
    let keywordConditions = params.keywordList.map(
      keyword => `{keywords_raw_contains: "${keyword}"}`,
    );
    condition += `description_: { or: [${keywordConditions.join(', ')}]},`;
  }

  // Add a searchQuery filter only if there are keyword filters
  if (params.keywordList && params.keywordList.length > 0 && params.searchQuery) {
    let keywordConditions = params.keywordList.map(
      keyword => `{keywords_raw_contains: "${keyword}"}`,
    );
    condition += `description_: { and: [ { or: [${keywordConditions.join(
      ', ',
    )}]}, {keywords_raw_contains: "${params.searchQuery}"} ] },`;
  } else if (params.searchQuery) {
    // If there are no keyword filters, add the searchQuery filter as usual
    condition += `description_: { or: [{keywords_raw_contains: "${params.searchQuery}"}]},`;
  }

  condition += '}';

  return condition === 'where: {}' ? '' : `, ${condition}`;
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

  console.log('query', query);

  return processRequest(query);
};
