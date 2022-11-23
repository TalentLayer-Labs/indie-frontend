import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import useServiceDetails from '../../hooks/useServiceDetails';
import { IService } from '../../types';
import { formatDate } from '../../utils/dates';

function ServiceTitle({ service }: { service: IService }) {
  const { user } = useContext(TalentLayerContext);
  const serviceDetail = useServiceDetails(service.uri);

  if (!serviceDetail) {
    return null;
  }

  const isBuyer = user?.id === service.buyer.id;
  const isSeller = user?.id === service.seller?.id;

  return (
    <>
      <p className='text-gray-900 font-medium'>{serviceDetail.title}</p>
      <p className='text-xs text-gray-500'>
        created by {isBuyer ? 'You' : service.buyer.handle} the{' '}
        {formatDate(Number(service.createdAt) * 1000)}
      </p>
    </>
  );
}

export default ServiceTitle;
