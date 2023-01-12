import React from 'react';
import useTotalGainByPlatform from '../hooks/useTotalGainByPlatform';
import StatisticBlockSingleValue from './StatisticBlockSingleValue';
import { useProvider, useSigner } from 'wagmi';
import usePlatformClaimedFees from '../hooks/usePlatformClaimedFees';
import { ethers } from 'ethers';
import { renderTokenAmount } from '../utils/conversion';

function PlatformGains({ platformId }: { platformId: string }) {
  const platformGains = useTotalGainByPlatform(platformId);
  const platformFeeClaimed = usePlatformClaimedFees(platformId);
  const { data: signer } = useSigner({ chainId: Number(platformId) });
  const provider = useProvider({ chainId: Number(platformId) });
  if (!platformGains || !signer || !provider) {
    return null;
  }

  return (
    <>
      {platformGains.map((platformGain, i) => {
        const token = platformGain?.token;
        const totalClaimedFees = platformFeeClaimed.find(
          platformFee => platformFee.token.address === token?.address,
        );
        const totalClaimableFee = ethers.BigNumber.from(platformGain?.totalPlatformFeeGain)
          .add(platformGain?.totalOriginPlatformFeeGain)
          .sub(totalClaimedFees?.amount || 0);

        return (
          <div key={i}>
            <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
              Gains on {token.name}
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-10'>
              <StatisticBlockSingleValue
                value={renderTokenAmount(token?.address, platformGain?.totalPlatformFeeGain)}
                label='Total fee gain on the platform'
                isGrowing={true}
              />
              <StatisticBlockSingleValue
                value={renderTokenAmount(token?.address, platformGain?.totalOriginPlatformFeeGain)}
                label='Total fee gain as an origin platform'
                isGrowing={true}
              />
              <StatisticBlockSingleValue
                value={renderTokenAmount(token?.address, totalClaimableFee.toString())}
                label={`Total claimable fee`}
                isGrowing={true}
                hideArrow={true}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default PlatformGains;
