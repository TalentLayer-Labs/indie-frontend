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
import TimeOutCountDown from '../../components/TimeoutCountDown';
import DisputeButton from '../../components/DisputeButton';
import useArbitrationCost from '../../hooks/useArbitrationCost';
import { ethers } from 'ethers';

function Dispute() {
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const proposal = useProposalById(proposalId as string);
  const transactionId = proposal?.service?.transaction?.id;
  const transaction = useTransactionsById(transactionId as string);
  // const arbitrationFee = useArbitrationCost(proposal?.service?.transaction?.arbitrator);
  const arbitrationCost = useArbitrationCost('0x2CA01a0058cfB3cc4755a7773881ea88eCfBba7C');
  console.log('arbitrationCost', arbitrationCost);

  // if (!transaction?.arbitrator || transaction?.arbitrator === ethers.constants.AddressZero) {
  // }

  const targetDate = 1683795557869 + Number(transaction?.arbitrationFeeTimeout) * 1000;
  // const targetDate = (transaction?.lastInteraction + transaction.arbitrationFeeTimeout) * 1000;

  //TODO Display both parties evidences
  //TODO Display link to meta evidences
  //TODO The Graph, need the time where fee was paid, so far just got "last interaction"

  // const evidences = useEvidences(transactionId);
  // console.log('evidences', evidences);
  const evidences: IEvidence[] = [
    {
      uri: 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v',
      party: {
        id: '3',
        address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
        handle: '0xRacoon',
        rating: '0',
        description: '',
        userStats: '',
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

  transaction ? (transaction.status = TransactionStatusEnum.NoDispute) : '';

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
      {user && proposal?.service.transaction.status === TransactionStatusEnum.NoDispute && (
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
                <div className={'flex-col flex'}>
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
                <div className={'flex'}></div>

                <div className={'flex flex-row flex gap-2 border border-gray-200 rounded-xl p-4'}>
                  <div className={''}>
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
                  {transaction && (
                    // (transaction.status === TransactionStatusEnum.WaitingReceiver ||
                    //   transaction.status === TransactionStatusEnum.WaitingSender) &&
                    <>
                      <div className={'flex flex-col'}>
                        <div className={'flex flex-row'}>
                          <TimeOutCountDown
                            targetDate={
                              targetDate
                              // (transaction?.lastInteraction + transaction.arbitrationFeeTimeout) * 1000
                            }
                          />
                        </div>
                        <DisputeButton
                          userId={user.id}
                          buyerId={proposal?.service.buyer.id}
                          sellerId={proposal.seller.id}
                          transactionStatus={transaction.status}
                          disabled={
                            targetDate > Date.now()
                            // (transaction?.lastInteraction + transaction.arbitrationFeeTimeout) * 1000
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {account?.isConnected && user && transactionId && (
                <EvidenceForm transactionId={transactionId} />
              )}
              <div className={'flex w-full space-y-4 flex-raw pb-4'}>
                <button
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
