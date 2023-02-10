// This file contains the GraphQL field types for each entity
// This should be replaced by GraphQL fragments in the future

export const rateTokenFields = `
  address
  decimals
  name
  symbol
`;

export const sellerFields = `
  id
  cid
  handle
  address
  withPoh
  rating
  numReviews
`;

export const serviceDescriptionFields = `
  id
  title
  about
  expectedHours
  startDate
`;

export const serviceFields = `
  id
  cid
  createdAt
  buyer {
    id
  }
`;

export const proposalsFields = `
  id
  cid
  status
  rateAmount
  createdAt
  updatedAt
  service {
    ${serviceFields}
  }
  rateToken {
    ${rateTokenFields}
  }
  seller {
    ${sellerFields}
  }
  description {
    ${serviceDescriptionFields}
  }
`;

export const paymentsFields = `
  id
  amount
  paymentType
  transactionHash
  rateToken {
    ${rateTokenFields}
  }
  service {
    ${serviceFields}
  }
`;

export const reviewsFields = `
    id
    rating
    createdAt
    service {
      id
      status
    }
    to {
      id
      handle
    }
    description{
      id
      content
    }
`;

export const serviceQueryFields = `
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
    rating
    numReviews
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
    rateAmount,
    rateToken {
      ${rateTokenFields}
    },
  }
`;

export const serviceDescriptionQueryFields = `
  id
  title
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

export const userDescriptionFields = `
  about
  country
  headline
  id
  picture
  title
  timezone
  skills_raw
`;

export const userFields = `
  id
  address
  handle
  withPoh
  rating
  numReviews
  updatedAt
  createdAt
  description {
    ${userDescriptionFields}
  }
`;
