import { MetaEvidence } from './types';

interface IInputValues {
  // fileURI: string;
  // fileHash: string;
  // fileTypeExtension: string;
  // category: string;
  title: string;
  description: string;
  sellerHandle: string;
  buyerHandle: string;
  // rulingOptions: {
  //   type: string;
  //   precision: number;
  //   titles: string[];
  //   descriptions: string[];
  // };
  evidenceDisplayInterfaceURI: string;
  evidenceDisplayInterfaceHash: string;
  dynamicScriptURI: string;
  dynamicScriptHash: string;
}
export const generateMetaEvidence = ({
  evidenceDisplayInterfaceHash,
  dynamicScriptHash,
  dynamicScriptURI,
  evidenceDisplayInterfaceURI,
  description,
  title,
  sellerHandle,
  buyerHandle,
}: IInputValues): MetaEvidence => {
  //TODO generate fileUriHash

  return {
    fileURI: '',
    fileHash: '',
    fileTypeExtension: 'pdf',
    category: 'Escrow',
    title: title,
    description: description,
    aliases: {
      ['buyer']: buyerHandle,
      ['seller']: sellerHandle,
    },
    question:
      'Did the seller deliver the service and deserves to be paid, or does the buyer deserve to be reimbursed ?',
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
