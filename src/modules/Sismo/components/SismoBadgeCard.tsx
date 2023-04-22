import { ISismoBadge } from '../utils/types';
import SismoHelpPopover from './SismoHelpPopover';

function SismoBadgeCard({ sismoBadgeData }: { sismoBadgeData: ISismoBadge }) {
  return (
    <a href='' target={'_blank'} className='relative'>
      <SismoHelpPopover>
        <p className='font-medium'>{sismoBadgeData.name}</p>
        <p>
          <strong>Description:</strong> {sismoBadgeData.description}
        </p>
      </SismoHelpPopover>
      <img src={`${sismoBadgeData.image}`} className='w-24 mr-4' />
    </a>
  );
}

export default SismoBadgeCard;
