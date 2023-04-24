import { useEffect, useState } from 'react';
import { getProposalById } from '../queries/proposals';
import { IProposal } from '../types';

const useProposalById = (id?: string | undefined): IProposal | undefined => {
  const [proposal, setProposal] = useState<IProposal>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getProposalById(id);
          if (response?.data?.data?.proposals[0]) {
            setProposal(response.data.data.proposals[0]);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      } else {
        setProposal(undefined);
      }
    };
    fetchData();
  }, [id]);

  return proposal;
};

export default useProposalById;
