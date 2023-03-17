import { useNavigate } from 'react-router-dom';
import { ISismoBadge, ISismoGroup } from '../types';

function SismoBadgeCard({ sismoBadgeData }: { sismoBadgeData: ISismoBadge }) {
  return (
    <div className='flex flex-row basis-1/4 gap-2 rounded-xl p-4 border border-gray-200 mr-4'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start'>
            <img src={`${sismoBadgeData.image}`} className='w-10 mr-4 rounded-full' />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{sismoBadgeData.name}</p>
              <p className='text-xs text-gray-500'></p>
            </div>
          </div>

          <div className=' border-t border-gray-100 pt-4'>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Description:</strong> {sismoBadgeData.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SismoBadgeCard;
