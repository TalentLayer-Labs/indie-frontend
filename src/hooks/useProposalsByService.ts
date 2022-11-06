import { useEffect, useState } from 'react';
import { getAllProposalsbyServiceId } from '../services/queries';
import { Proposal } from '../types';

const useProposalsByService = (serviceId?: string | undefined): Proposal[] => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (serviceId) {
        try {
          const response = await getAllProposalsbyServiceId(serviceId);

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
  }, [serviceId]);

  return proposals;
};

export default useProposalsByService;
