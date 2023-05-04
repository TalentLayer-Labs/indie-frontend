import { MetadataColumn } from '@/types/kleros/types';
import { BackendFileResponse, BackendFileUpload } from '@/types/utils';

export type KlerosListStructure = {
  name: string;
  title: string;
  description: string;
  rulingOptions: {
    titles: string[];
    descriptions: string[];
  };
  category: string;
  question: string;
  fileURI: BackendFileUpload | BackendFileResponse;
  evidenceDisplayInterfaceURI: string;
  metadata: {
    tcrTitle: string;
    tcrDescription: string;
    columns: MetadataColumn[];
    itemName: string;
    itemNamePlural: string;
    logoURI: BackendFileUpload | BackendFileResponse;
    requireRemovalEvidence: boolean;
    isTCRofTCRs: boolean;
    relTcrDisabled: boolean;
    parentTCRAddress?: string;
  };
  _v?: string;
  evidenceDisplayInterfaceRequiredParams?: string[];
};

export function generateKlerosListMetaEvidence(
  badgeName: string,
  fileURI: BackendFileUpload,
  badgeTypeName: string,
  badgeTypeDescription: string,
  badgeMetadataColumns: MetadataColumn[],
  logoURI: BackendFileUpload,
  requireRemovalEvidence = true,
  relTcrDisabled = true, // research about it
  category = 'Curated Lists',
  evidenceDisplayInterfaceURI = '/ipfs/QmQjJio59WkrQDzPC5kSP3EiGaqrWxjGfkvhmD2mWwm41M/index.html',
): { registration: KlerosListStructure; clearing: KlerosListStructure } {
  // TODO
  // check max items indexed = 3

  const itemNamePlural = `${badgeName}s`;

  const registration: KlerosListStructure = {
    name: badgeTypeName,
    title: `${badgeTypeName} evidences.`,
    description: `Add the evidence of the badge ${badgeName} to the list of evidences of ${badgeTypeName}.`,
    rulingOptions: {
      titles: ['Yes, Add It', "No, Don't Add It"],
      descriptions: [
        `Select this if you think the ${badgeName} complies with the required criteria and should be added.`,
        `Select this if you think the ${badgeName} does not comply with the required criteria and should not be added.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  };

  const clearing: KlerosListStructure = {
    name: badgeTypeName,
    title: `Remove a ${badgeName} from ${itemNamePlural}`,
    description: `Someone requested to remove a ${badgeName} to ${itemNamePlural}`,
    rulingOptions: {
      titles: ['Yes, Remove It', "No, Don't Remove It"],
      descriptions: [
        `Select this if you think the ${badgeName} does not comply with the required criteria and should be removed.`,
        `Select this if you think the ${badgeName} complies with the required criteria and should not be removed.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  };

  return { registration, clearing };
}
