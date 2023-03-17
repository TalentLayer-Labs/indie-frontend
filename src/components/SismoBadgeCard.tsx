import { ISismoBadge } from '../types';
import SismoHelpPopover from './SismoHelpPopover';

function SismoBadgeCard({ sismoBadgeData }: { sismoBadgeData: ISismoBadge }) {
  return (
    <div className='rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start relative'>
            <img src={`${sismoBadgeData.image}`} className='w-10 mr-4' />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{sismoBadgeData.name}</p>
            </div>
            <SismoHelpPopover>
              <p>
                <strong>Description:</strong> {sismoBadgeData.description}
              </p>
            </SismoHelpPopover>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SismoBadgeCard;
