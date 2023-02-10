import { ServiceStatusEnum } from '../types';
import { processRequest } from '../utils/graphql';
import { serviceDescriptionQueryFields, serviceQueryFields } from './fieldTypes';

export interface IServiceQueryProps {
  serviceStatus?: ServiceStatusEnum;
  buyerId?: string;
  sellerId?: string;
  platformId?: string;
  searchQuery?: string;
}

const getFilterCondition = (params: IServiceQueryProps) => {
  let condition = ', where: {';
  condition += params.serviceStatus ? `status: "${params.serviceStatus}"` : '';
  condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
  condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
  condition += params.platformId ? `, platform: "${params.platformId}"` : '';
  condition += '}';
  return condition === ', where: {}' ? '' : condition;
};

export const getServices = (params: IServiceQueryProps): Promise<any> => {
  const query = `
    {
      services(orderBy: id, orderDirection: desc ${getFilterCondition(params)}) {
        ${serviceQueryFields}
        description {
          ${serviceDescriptionQueryFields}
        }
      }
    }`;

  return processRequest(query);
};

export const searchServices = (params: IServiceQueryProps): Promise<any> => {
  const query = `
    {
      serviceDescriptionSearchRank(
        text: "${params.searchQuery}",
        orderBy: id, orderDirection: desc ${getFilterCondition(params)}
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
