import { useState, useEffect } from 'react';
import { ProposalDetails } from '../types';
import { isValidHttpsUrl } from '../utils';

const useProposalDetails = (uri: string): ProposalDetails | null => {
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isValidHttpsUrl(uri)) {
          throw new Error('Uri not valid: ' + uri);
        }

        const response = await fetch(uri);
        const data: ProposalDetails = await response.json();
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
