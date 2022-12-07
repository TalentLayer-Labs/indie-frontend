import { useState, useEffect } from 'react';
import { IProposalDetails } from '../types';

const useProposalDetails = (uri: string): IProposalDetails | null => {
  const [proposalDetails, setProposalDetails] = useState<IProposalDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullProposalDetailsUri = `${import.meta.env.VITE_IPFS_BASE_URL}${uri}`;

        const response = await fetch(fullProposalDetailsUri);
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
