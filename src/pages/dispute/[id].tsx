import { useContext, useState } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import EvidenceForm from '../../components/Form/EvidenceForm';
import { IEvidence, TransactionStatusEnum } from '../../types';
import { IERC1497Evidence } from '../../modules/Kleros/utils/types';
import DisputeItem from '../../modules/Kleros/components/DisputeDetail';
import useTransactionsById from '../../hooks/useTransactionsById';

function Dispute() {
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const proposal = useProposalById(proposalId as string);
  console.log('proposal', proposal);
  const transactionId = proposal?.service?.transaction?.id;
  const transaction = useTransactionsById(transactionId as string);
  //TODO: RPC call to get fee, or handle with the graph when update ?
  //TODO Display both parties evidences
  //TODO Display link to meta evidences

  // const evidences = useEvidences(transactionId);
  // console.log('evidences', evidences);
  const evidences: IEvidence[] = [
    {
      uri: 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v',
      party: {
        id: '3',
      },
      id: '',
      transaction: '',
      createdAt: '',
    },
  ];

  const buyerEvidences = evidences.filter(
    evidence => evidence.party.id === proposal?.service.buyer.id,
  );
  const sellerEvidences = evidences.filter(evidence => evidence.party.id === proposal?.seller.id);

  if (
    user &&
    proposal &&
    proposalId &&
    user.id !== proposal?.service.buyer.id &&
    user.id !== proposal?.seller.id
  ) {
    router.back();
  }

  if (!proposal?.service?.transaction?.id) {
    return <Loading />;
  }

  return (
    <>
      {proposal?.service.transaction.status === TransactionStatusEnum.NoDispute && (
        <>
          <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
            <p className='text-5xl font-medium tracking-wider mb-8'>
              Raise <span className='text-indigo-600'>a dispute</span>
            </p>
            <div className={'flex-col border border-gray-200 rounded-md p-8'}>
              <h2 className='mb-2 text-gray-900 font-bold'>Dispute details:</h2>
              {/*<DisputeItem />*/}
              <div
                className={
                  'flex flex-row justify-between gap-2 rounded-xl p-4 border border-gray-200'
                }>
                <div className={'flex-col'}>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Service:</strong> {proposal.service.description?.title}
                  </p>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Buyer evidences:</strong>
                    {evidences.length > 0 &&
                      buyerEvidences.map(evidence => {
                        return (
                          <div className={'mb-4 pb-4'}>
                            {/*TODO href to details ?*/}
                            <div className={'mb-2'}>{evidence.uri}</div>
                          </div>
                        );
                      })}
                  </p>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Seller evidences:</strong>
                    {evidences.length > 0 &&
                      sellerEvidences.map(evidence => {
                        return (
                          <div className={'mb-4 pb-4'}>
                            {/*TODO href to details ?*/}
                            <div className={'mb-2'}>{evidence.uri}</div>
                          </div>
                        );
                      })}
                  </p>
                </div>

                <div className={'flex-col'}>
                  <div className={'border border-gray-200 rounded-xl p-4'}>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Status:</strong> {transaction?.status}
                    </p>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Buyer fee:</strong> {transaction?.senderFee}
                    </p>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Seller fee:</strong> {transaction?.receiverFee}
                    </p>
                  </div>
                </div>
              </div>
              {account?.isConnected && user && transactionId && (
                <EvidenceForm transactionId={transactionId} />
              )}
              <div className={'flex w-full space-y-4 flex-raw pb-4'}>
                <button
                  type='submit'
                  className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}>
                  Raise dispute
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dispute;
