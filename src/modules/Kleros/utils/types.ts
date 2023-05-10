export type IMetaEvidence = {
  fileURI: string;
  fileHash: string;
  fileTypeExtension: string;
  category: string;
  title: string;
  description: string;
  aliases: {
    [string: string]: string;
  };
  question: string;
  rulingOptions: {
    type: string;
    precision: number;
    titles: string[];
    descriptions: string[];
  };
  evidenceDisplayInterfaceURI: string;
  evidenceDisplayInterfaceHash: string;
  dynamicScriptURI: string;
  dynamicScriptHash: string;
};

export type IERC1497Evidence = {
  fileUri: string;
  fileHash: string;
  fileTypeExtension: string;
  name: string;
  description: string;
};
