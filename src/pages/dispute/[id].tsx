import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import EvidenceForm from '../../components/Form/EvidenceForm';
import { TransactionStatusEnum } from '../../types';
import useTransactionsById from '../../hooks/useTransactionsById';
import DisputeButton from '../../components/DisputeButton';
import useArbitrationCost from '../../hooks/useArbitrationCost';
import { ethers } from 'ethers';
import Steps from '../../components/Steps';
import DisputeStatusCard from '../../modules/Disputes/components/DisputeDetail';
import EvidenceDetails from '../../modules/Disputes/components/EvidenceDetails';

function Dispute() {
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const proposal = useProposalById(proposalId as string);
  const transactionId = proposal?.service?.transaction?.id;
  const transaction = useTransactionsById(transactionId as string);
  const arbitrationFee = useArbitrationCost(transaction?.arbitrator);

  transaction ? (transaction.status = TransactionStatusEnum.WaitingSender) : '';
  if (
    user &&
    proposalId &&
    proposal &&
    user.id !== proposal?.service.buyer.id &&
    user.id !== proposal?.seller.id
  ) {
    return (
      <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
        <p className='text-5xl font-medium tracking-wider mb-8'>
          Raise <span className='text-indigo-600'>a dispute</span>
        </p>

        <Steps targetTitle={'Access the dispute dashboard'} />
        <div className={'p-8'}>
          <h2 className='mb-2 text-xl text-gray-900'>Your are not related to this transaction</h2>
        </div>
      </div>
    );
  }

  if (
    (transaction && !transaction?.arbitrator) ||
    (transaction && transaction?.arbitrator === ethers.constants.AddressZero)
  ) {
    return (
      <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
        <p className='text-5xl font-medium tracking-wider mb-8'>
          Raise <span className='text-indigo-600'>a dispute</span>
        </p>

        <Steps targetTitle={'Access the dispute dashboard'} />
        <div className={'p-8'}>
          <h2 className='mb-2 text-xl text-gray-900'>
            Your platform has not implemented an arbitrator, you cannot raise a dispute yet :(
          </h2>
        </div>
      </div>
    );
  }

  if (!transactionId) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Raise <span className='text-indigo-600'>a dispute</span>
      </p>

      <Steps targetTitle={'Access the dispute dashboard'} />
      {user && (
        <>
          <div className={'flex-col border border-gray-200 rounded-md p-8'}>
            <h2 className='mb-2 text-gray-900 font-bold'>Dispute details:</h2>
            <div
              className={
                'flex flex-row justify-between gap-2 rounded-xl p-4 border border-gray-200'
              }>
              <div className={'flex-col flex'}>
                <p className={'text-sm text-gray-500 mt-2'}>
                  <strong>Service:</strong> {proposal.service.description?.title}
                </p>
                {transaction && <EvidenceDetails proposal={proposal} transaction={transaction} />}
              </div>
              <div className={'flex flex-row h-min gap-2 border border-gray-200 rounded-xl p-4'}>
                {transaction && arbitrationFee && (
                  <DisputeStatusCard
                    transaction={transaction}
                    user={user}
                    arbitrationFee={arbitrationFee}
                  />
                )}
              </div>
            </div>
            {account?.isConnected &&
              transactionId &&
              transaction?.status !== TransactionStatusEnum.Resolved && (
                <EvidenceForm transactionId={transactionId} />
              )}
            {transaction?.status === TransactionStatusEnum.NoDispute && arbitrationFee && (
              <div className={'flex w-full space-y-4 flex-raw pb-4'}>
                <DisputeButton
                  user={user}
                  transaction={transaction}
                  disabled={false}
                  arbitrationFee={arbitrationFee}
                  content={'Raise dispute'}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dispute;
