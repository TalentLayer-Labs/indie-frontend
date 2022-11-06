/* eslint-disable no-console */
import axios from 'axios';
import { ServiceStatus } from '../types';

const processRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_APP_SUBGRAPH_URL, { query });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSellerCompletedServices = (id: string): Promise<any> => {
  const query = `
        {
          user(id: "${id}") {
            sellerServices(where: {status: Finished}) {
              id
            }
          }
        }
  `;
  return processRequest(query);
};

export const getBuyerCompletedServices = (id: string): Promise<any> => {
  const query = `
 {
    user(id: "${id}") {
      buyerServices(where: {status: Finished}) {
        id
      }
    }
  }
  `;
  return processRequest(query);
};

export const getProposalById = (id: string): Promise<any> => {
  const query = `
    {
    proposal(id: "${id}") {
      id
      service {
        id,
        uri
      },
      status
      rateToken
      rateAmount
      uri
      createdAt
      updatedAt
      seller {
        id
      }
    }
  }
  `;
  return processRequest(query);
};

export const getProposalCount = (id: string, active: boolean): Promise<any> => {
  let query: string;
  if (active) {
    query = `
    {
      proposals(where: {service_: {id: "${id}"} , status: Pending}) {
        id
      }
    }
  `;
  } else {
    query = `
    {
      proposals(where: {service_: {id: "${id}"} , status_not: Pending}) {
        id
      }
    }
    `;
  }
  return processRequest(query);
};

export const getAllProposalsbyServiceId = (id: string): Promise<any> => {
  const query = `
  {
    proposals(where: {service_: {id: "${id}"}}) {
      service {
        id
        buyer {
          id
        }
      }
      uri
      id
      status
      rateToken
      rateAmount
      createdAt
      updatedAt
      seller {
        id
        handle
        address
        uri
        withPoh
        rating
        numReviews
      }
    }
  }
  `;
  return processRequest(query);
};

export const getUsers = (): Promise<any> => {
  const query = `
  {
    users(orderBy: id, orderDirection: desc) {
      id
      address
      uri
      handle
      withPoh
      numReviews
      rating
    }
  }
  `;
  return processRequest(query);
};

export const getUserByHandle = (handle: string): Promise<any> => {
  const query = `
  {
    users(where: {handle_contains_nocase: "${handle}"}, first: 1) {
      id
      address
      uri
      handle
      withPoh
      rating
      numReviews
    }
  }
  `;
  return processRequest(query);
};

export const getUserById = (id: string): Promise<any> => {
  const query = `
  {
    user(id: "${id}") {
      id
      address
      uri
      handle
      withPoh
      rating
      numReviews
    }
  }
  `;
  return processRequest(query);
};

export const getUserByAddress = (address: string): Promise<any> => {
  const query = `
  {
    users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
      id
      address
      uri
      handle
      withPoh
      rating
      numReviews
    }
  }
  `;
  return processRequest(query);
};

export const getServices = (
  serviceStatus?: ServiceStatus,
  buyerId?: string,
  sellerId?: string,
): Promise<any> => {
  let condition = '';

  if (serviceStatus) {
    condition = `, where: {status: ${serviceStatus}}`;
  } else if (buyerId) {
    condition = `, where: {buyer: "${buyerId}"}`;
  } else if (sellerId) {
    condition = `, where: {seller: "${sellerId}"}`;
  }

  const query = `
  {
    services(orderBy: id, orderDirection: desc ${condition}) {
      id
      status
      createdAt
      uri
      buyer {
        id
        handle
      }
      seller {
        id
        handle
      }
      proposals {
        id
      }
    }
  }`;
  return processRequest(query);
};

export const getServiceById = (id: string): Promise<any> => {
  const query = `
  {
    service(id: "${id}") {
      id,
      status,
      sender,
      uri,
      createdAt,
      updatedAt
    }
  }
  `;
  return processRequest(query);
};

export const getReviews = (): Promise<any> => {
  const query = `
  {
    reviews(orderBy: id, orderDirection: desc) {
      id
      service {
        id
        status
      }
      to {
        id
        handle
      }
      uri
    }
  }
  `;
  return processRequest(query);
};
export const getReviewsByUser = (userId: string): Promise<any> => {
  const query = `{
    reviews(where: {to_: {id: "${userId}"}}) {
      id
      uri
      to {
        handle
        id
        numReviews
        rating
      }
    }
  }`;
  return processRequest(query);
};
export const getReviewsByHandle = (handle: string): Promise<any> => {
  const query = `{
    reviews(
      where: {to_: {handle_contains_nocase: "${handle}"}}
      orderBy: id
      orderDirection: desc
    ) {
      id
      service {
        id
        status
      }
      to {
        id
        handle
      }
      uri
    }
  }`;
  return processRequest(query);
};

export const getReviewsByService = (serviceId: string): Promise<any> => {
  const query = `
  {
    reviews(where: { service: "${serviceId}" }, orderBy: id, orderDirection: desc) {
      id
      service {
        id
        status
      }
      to {
        id
        handle
      }
      uri
    }
  }
  `;
  return processRequest(query);
};

export const getReview = (id: string): Promise<any> => {
  const query = `
  {
    review(id: ${id}) {
      id
    }
  }
  `;
  return processRequest(query);
};

export const getBuyerServiceData = (id: string): Promise<any> => {
  const query = `
  {
    service(id: "${id}") {
      uri
      createdAt
      updatedAt
      buyer {
        rating,
        handle
        id
        buyerServices(where: {status: Finished}) {
          id
        }
      }
    }
  }
  `;
  return processRequest(query);
};

// Reminder: Proposal ID is the same as User ID
export const getProposalByServiceIdAndUser = (
  serviceId: string,
  proposalId: string,
): Promise<any> => {
  const query = `
    {
    service(id: "${serviceId}") {
      id
      uri
      proposals(where: {id: "${proposalId}"}) {
        id
        rateAmount
        rateToken
        status
        uri
        service {
          id
          uri
        }
      }
    }
  }
  `;
  return processRequest(query);
};

export const getAllProposalsByUserHandle = (userHandle: string): Promise<any> => {
  const query = `
    {
      proposals(where: {seller_: {handle: "${userHandle}"}}) {
        id
        rateAmount
        rateToken
        status
        uri
        seller {
          handle
        }
        service {
          id
          uri
          buyer {
            handle
          }
        }
      }
    }
  `;
  return processRequest(query);
};
