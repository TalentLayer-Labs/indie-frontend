import { useEffect, useState } from 'react';
import { getAllProposalsByUser } from '../services/queries';
import { Proposal } from '../types';

const useProposalsByUser = (id?: string | undefined): Proposal[] => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getAllProposalsByUser(id);

          if (response?.data?.data?.proposals) {
            setProposals(response.data.data.proposals);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      } else {
        setProposals([]);
      }
    };
    fetchData();
  }, [id]);

  return proposals;
};

export default useProposalsByUser;
