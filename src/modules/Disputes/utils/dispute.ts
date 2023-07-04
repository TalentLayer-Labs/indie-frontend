import { IERC1497Evidence, IMetaEvidence } from './types';

export const generateMetaEvidence = (
  serviceDescription: string,
  proposalDescription: string,
  buyerHandle: string,
  sellerHandle: string,
  tokenAddress: string,
  tokenSymbol: string,
  tokenAmount: string,
  title: string,
  startDate?: string,
  expectedEndDate?: string,
): IMetaEvidence => {
  //TODO generate fileUriHash
  //TODO mention users addresses somewhere ?

  return {
    fileURI: '',
    fileHash: '',
    fileTypeExtension: 'pdf',
    category: 'Escrow',
    title: title,
    description: generateMetaEvidenceDescription(
      serviceDescription,
      proposalDescription,
      buyerHandle,
      sellerHandle,
      tokenAddress,
      tokenSymbol,
      tokenAmount,
      startDate,
      expectedEndDate,
    ),
    aliases: {
      ['buyer']: buyerHandle,
      ['seller']: sellerHandle,
    },
    question:
      'Did the seller deliver what was agreed on and deserves to be paid, or does the buyer deserve to be reimbursed ?',
    rulingOptions: {
      type: 'single-select',
      precision: 1,
      titles: ['Reimburse Buyer', 'Release funds to Seller'],
      descriptions: ['Select to reimburse the buyer', 'Select to release funds to the seller'],
    },
    evidenceDisplayInterfaceURI: '',
    evidenceDisplayInterfaceHash: '',
    dynamicScriptURI: '',
    dynamicScriptHash: '',
  };
};

const generateMetaEvidenceDescription = (
  buyerVersion: string,
  sellerVersion: string,
  buyerHandle: string,
  sellerHandle: string,
  tokenAddress: string,
  tokenSymbol: string,
  tokenAmount: string,
  startDate?: string,
  expectedEndDate?: string,
): string => {
  let description = `The TalentLayer user ${buyerHandle} has posted a service request, to which the user ${sellerHandle} has submitted a proposal for ${tokenAmount} ${tokenSymbol} tokens. 
  The service description is: ${buyerVersion}.
  The proposal description is: ${sellerVersion}.
  The buyer has put in escrow ${tokenAmount} ${tokenSymbol} tokens to the contract address ${tokenAddress}.
  The amount in escrow will be released to the seller upon completion of the terms described in the proposal, or reimbursed to the buyer.`;

  startDate && expectedEndDate
    ? (description =
        description +
        ` The service is expected to start on ${startDate} and end on ${expectedEndDate}.`)
    : '';
  return description;
};

export const generateEvidence = (
  title: string,
  description: string,
  evidenceCid: string,
  fileExtension: string,
): IERC1497Evidence => {
  return {
    fileUri: `/ipfs/${evidenceCid}`,
    fileHash: evidenceCid,
    fileTypeExtension: fileExtension,
    name: title,
    description: description,
  };
};
