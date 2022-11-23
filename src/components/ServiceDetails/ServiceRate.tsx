import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import usePaymentsByService from '../../hooks/usePaymentsByService';
import useServiceDetails from '../../hooks/useServiceDetails';
import { renderTokenAmount } from '../../utils/conversion';
import { IService } from '../../types';
import { formatDate } from '../../utils/dates';

function ServiceRate({ service }: { service: IService }) {
  const { account, user } = useContext(TalentLayerContext);
  const serviceDetail = useServiceDetails(service.uri);
  const payments = usePaymentsByService(service.id);

  if (!serviceDetail) {
    return null;
  }

  const isBuyer = user?.id === service.buyer.id;
  const isSeller = user?.id === service.seller?.id;

  return (
    <>
      <div className=' border-gray-100 w-full'>
        <p className='text-sm text-gray-500'>
          {renderTokenAmount(serviceDetail.rateToken, serviceDetail.rateAmount)}
        </p>
      </div>
    </>
  );
}

export default ServiceRate;
