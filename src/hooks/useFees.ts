import { useEffect, useState } from 'react';
import { getProtocolAndPlatformsFees } from '../queries/fees';
import { IFees } from '../types';

const useFees = (
  originServicePlatformId: string,
  originValidatedProposalPlatformId: string,
): IFees => {
  const [fees, setFees] = useState({
    protocolEscrowFeeRate: 0,
    originServiceFeeRate: 0,
    originValidatedProposalFeeRate: 0,
  });

  useEffect(() => {
    const fees: IFees = {
      protocolEscrowFeeRate: 0,
      originServiceFeeRate: 0,
      originValidatedProposalFeeRate: 0,
    };
    const fetchData = async () => {
      try {
        const response = await getProtocolAndPlatformsFees(
          originServicePlatformId,
          originValidatedProposalPlatformId,
        );
        const data = response.data.data;

        if (data) {
          fees.protocolEscrowFeeRate = data.protocols[0].protocolEscrowFeeRate;
          fees.originServiceFeeRate = data.servicePlatform.originServiceFeeRate;
          fees.originValidatedProposalFeeRate =
            data.proposalPlatform.originValidatedProposalFeeRate;
        }

        setFees(fees);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [originServicePlatformId, originValidatedProposalPlatformId]);

  return fees;
};

export default useFees;
