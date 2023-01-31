import React from 'react';
import useTotalGainByPlatform from '../hooks/useTotalGainByPlatform';
import StatisticBlockSingleValue from './StatisticBlockSingleValue';
import { useProvider, useSigner } from 'wagmi';
import usePlatformClaimedFees from '../hooks/usePlatformClaimedFees';
import { ethers } from 'ethers';
import { renderTokenAmount } from '../utils/conversion';
import { config } from '../config';
import { Bar } from 'react-chartjs-2';
import useFeePayments from '../hooks/useFeePayment';
import { getFeePaymentsByToken, getTotalAmountThisDay } from '../utils/feePaymentsManipulations';

function PlatformGains({ platformId }: { platformId: string }) {
  const platformGains = useTotalGainByPlatform(platformId);
  const platformFeeClaimed = usePlatformClaimedFees(platformId);
  const { data: signer } = useSigner({ chainId: Number(platformId) });
  const provider = useProvider({ chainId: Number(platformId) });
  const feePayments = useFeePayments(platformId);
  if (!platformGains || !signer || !provider || !feePayments) {
    return null;
  }

  const chartData = {
    labels: ['loading'],
    datasets: [
      {
        label: 'Loading',
        data: ['loading'],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const colors = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'];
  const feePaymentsByToken = getFeePaymentsByToken(config.tokens, feePayments);
  // For each token, create a dataset
  feePaymentsByToken.forEach((feePaymentByToken, index) => {
    if (feePaymentByToken.length == 0) return;

    const token = feePaymentByToken[0].token;
    const dataFeePayments = getTotalAmountThisDay(feePayments, token);

    // Clean the chartData and Add the dataset
    if (chartData.datasets[0].label == 'Loading') chartData.datasets.shift();
    chartData.labels = dataFeePayments.map(feePayment => String(feePayment.day));
    chartData.datasets.push({
      label: token.symbol,
      data: dataFeePayments.map(feePayment => feePayment.amount),
      backgroundColor: colors[index],
    });
  });

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

      <div className='shadow-lg rounded-lg overflow-hidden'>
        <div className='py-3 px-5 bg-gray-50'>Gains repartition on the month</div>
        <Bar data={chartData} className='p-2' />
      </div>
    </>
  );
}

export default PlatformGains;
