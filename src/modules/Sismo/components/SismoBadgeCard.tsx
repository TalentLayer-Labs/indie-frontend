import Image from 'next/image';
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
      <Image
        src={`${sismoBadgeData.image}`}
        className='w-24 mr-4'
        alt=''
        width={200}
        height={200}
      />
    </a>
  );
}

export default SismoBadgeCard;
