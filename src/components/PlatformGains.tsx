import React from 'react';
import useTotalGainByPlatform from '../hooks/useTotalGainByPlatform';
import StatisticBlockSingleValue from './StatisticBlockSingleValue';

function PlatformGains({ platformId }: { platformId: string }) {
  const platformGains = useTotalGainByPlatform(platformId);
  if (!platformGains) {
    return null;
  }
  const totalPlatformFeeGain =
    Number(platformGains?.totalPlatformFeeGain) / 10 ** platformGains?.token?.decimals;
  const totalOriginPlatformFeeGain =
    Number(platformGains?.totalOriginPlatformFeeGain) / 10 ** platformGains?.token?.decimals;

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>Gains</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        <StatisticBlockSingleValue
          value={`${totalPlatformFeeGain} ${platformGains.token.symbol}`}
          label='Total fee gain on the platform'
          isGrowing={true}
        />
        <StatisticBlockSingleValue
          value={`${totalOriginPlatformFeeGain} ${platformGains.token.symbol}`}
          label='Total fee gain as an origin platform'
          isGrowing={true}
        />
      </div>
    </>
  );
}

export default PlatformGains;
