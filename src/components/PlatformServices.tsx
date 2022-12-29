import React from 'react';
import StatisticBlockSingleValue from './StatisticBlockSingleValue';
import useServices from '../hooks/useServices';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ServiceStatusEnum } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PlatformServices({ platformId }: { platformId: string }) {
  const services = useServices();
  if (services.length === 0) {
    return null;
  }

  const totalServices = services.length.toString();
  const labels = Object.values(ServiceStatusEnum);
  const quantityByLabel = labels.map(label => {
    return services.filter(service => service.status === label).length;
  });
  const serviceData = {
    labels,
    datasets: [
      {
        label: 'Service',
        data: quantityByLabel,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Services
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <StatisticBlockSingleValue
            value={totalServices}
            label='Total services on the platform'
            isGrowing={true}
          />
        </div>
        <div className='shadow-lg rounded-lg overflow-hidden'>
          <div className='py-3 px-5 bg-gray-50'>Repartition</div>
          <Bar data={serviceData} className='p-2' />
        </div>
      </div>
    </>
  );
}

export default PlatformServices;
