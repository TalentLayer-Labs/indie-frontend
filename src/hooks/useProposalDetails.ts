import { useState, useEffect } from 'react';
import { IProposalDetails } from '../types';
import { isValidHttpsUrl } from '../utils';

const useProposalDetails = (uri: string): IProposalDetails | null => {
  const [proposalDetails, setProposalDetails] = useState<IProposalDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isValidHttpsUrl(uri)) {
          throw new Error('Uri not valid: ' + uri);
        }

        const response = await fetch(uri);
        const data: IProposalDetails = await response.json();
        if (data) {
          setProposalDetails(data);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [uri]);

  return proposalDetails;
};

export default useProposalDetails;
