import { useEffect, useState } from 'react';
import { IFees } from '../types';
import {
  getOriginProposalValidatedPlatformId,
  getProtocolAndOriginServiceFee,
} from '../queries/fees';

const useFees = (
  originValidatedProposalPlatformId: number,
  originServicePlatformId: number,
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
        const response1 = await getProtocolAndOriginServiceFee(originServicePlatformId);

        if (response1?.data?.data?.protocols && response1?.data?.data?.platforms) {
          fees.protocolEscrowFeeRate = response1.data.data.protocols[0].protocolEscrowFeeRate;
          response1.data.data.platforms[0].originServiceFeeRate;
        }

        const response2 = await getOriginProposalValidatedPlatformId(
          originValidatedProposalPlatformId,
        );

        if (response2?.data?.data?.protocols && response2?.data?.data?.platforms) {
          fees.originValidatedProposalFeeRate =
            response2.data.data.platforms[0].originValidatedProposalFeeRate;
        }
        setFees(fees);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return fees;
};

export default useFees;
