import React from 'react';
import useTotalGainByPlatform from '../hooks/useTotalGainByPlatform';
import StatisticBlockSingleValue from './StatisticBlockSingleValue';

function PlatformGains({ platformId }: { platformId: string }) {
  const platformGains = useTotalGainByPlatform(platformId);
  if (!platformGains) {
    return null;
  }

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Your total gains
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        <StatisticBlockSingleValue
          value={`${platformGains.totalPlatformFeeGain} ${platformGains.token.symbol}`}
          label='Total fee gains on the platform'
          isGrowing={true}
        />
        <StatisticBlockSingleValue
          value={`${platformGains.totalOriginPlatformFeeGain} ${platformGains.token.symbol}`}
          label='Total fee gains as an origin platform'
          isGrowing={true}
        />
      </div>
    </>
  );
}

export default PlatformGains;
