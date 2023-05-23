import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import EvidenceForm from '../../components/Form/EvidenceForm';
import { TransactionStatusEnum } from '../../types';
import { IERC1497Evidence } from '../../modules/Kleros/utils/types';
import useTransactionsById from '../../hooks/useTransactionsById';
import TimeOutCountDown from '../../components/TimeoutCountDown';
import DisputeButton from '../../components/DisputeButton';
import useArbitrationCost from '../../hooks/useArbitrationCost';
import { ethers } from 'ethers';
import useEvidences from '../../hooks/useEvidences';
import useIpfsJsonData from '../../hooks/useIpfsJsonData';
import { useProvider, useSigner } from 'wagmi';
import { arbitrationFeeTimeout, payArbitrationFee } from '../../contracts/disputes';

function Dispute() {
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const proposal = useProposalById(proposalId as string);
  const transactionId = proposal?.service?.transaction?.id;
  const transaction = useTransactionsById(transactionId as string);
  const arbitrationFee = useArbitrationCost(transaction?.arbitrator);
  const evidences = useEvidences(transactionId);
  // console.log('arbitrationCost', arbitrationFee);
  // console.log('evidences', evidences);
  // console.log('transaction', transaction);

  const evidenceDetail: IERC1497Evidence = useIpfsJsonData(
    evidences && evidences.length > 0 && evidences[0].uri,
  );

  const isSender = (): boolean => {
    return !!user && !!transaction && user.id === transaction.sender.id;
  };

  const isReceiver = (): boolean => {
    return !!user && !!transaction && user.id === transaction.receiver.id;
  };

  if (
    (transaction && !transaction?.arbitrator) ||
    (transaction && transaction?.arbitrator === ethers.constants.AddressZero)
  ) {
    //TODO decide what behavior we want here
    return;
  }
  const getTargetDate = () => {
    if (
      isSender() &&
      transaction &&
      (transaction.senderFeePaidAt || transaction.receiverFeePaidAt)
    ) {
      return (
        (Number(transaction.senderFeePaidAt) + Number(transaction.arbitrationFeeTimeout)) * 1000
      );
    }

    if (
      isReceiver() &&
      transaction &&
      (transaction.senderFeePaidAt || transaction.receiverFeePaidAt)
    ) {
      return (
        (Number(transaction.senderFeePaidAt || transaction.receiverFeePaidAt) +
          Number(transaction.arbitrationFeeTimeout)) *
        1000
      );
    }
    return 0;
  };

  //TODO Multistep tx toast ? Or custom toast if no ipfs mapping on the graph ?
  //TODO Evidence Modal + Download evidence or display if pic ? Custom according to file extention ?

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
    //TODO return; instead ?
  }

  const payFee = () => {
    if (signer && user && transaction && arbitrationFee) {
      return payArbitrationFee({
        signer,
        provider,
        arbitrationFee,
        user,
        transaction,
        router,
      });
    }
  };
  const timeout = () => {
    if (signer && user && transactionId) {
      return arbitrationFeeTimeout({
        signer,
        provider,
        transactionId,
        router,
      });
    }
  };

  if (!transactionId) {
    return <Loading />;
  }

  return (
    <>
      {user && (
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
                          <div className={'mb-4 pb-4'} key={evidence.id}>
                            <a
                              href={`https://cloudflare-ipfs.com/ipfs/${evidence.uri}`}
                              className={'mb-2'}>
                              {evidence.uri}
                            </a>
                          </div>
                        );
                      })}
                  </p>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Seller evidences:</strong>
                    {evidences.length > 0 &&
                      sellerEvidences.map(evidence => {
                        return (
                          <div className={'flex flex-row'} key={evidence.id}>
                            <a
                              href={`https://cloudflare-ipfs.com/ipfs/${evidence.uri}`}
                              className={'mb-1 hover:underline'}>
                              {evidence.uri}
                            </a>
                            {/*<ArrowUpOnSquareIcon*/}
                            {/*  className={'h-4 ml-2 cursor-pointer w-4 text-gray-900'}*/}
                            {/*/>*/}
                          </div>
                        );
                      })}
                  </p>
                </div>
                <div className={'flex'}>
                  {evidenceDetail && (
                    <img src={`https://cloudflare-ipfs.com/ipfs/${evidenceDetail.fileHash}`} />
                  )}
                </div>

                <div className={'flex flex-row h-min gap-2 border border-gray-200 rounded-xl p-4'}>
                  <div className={''}>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Status:</strong> {transaction?.status}
                    </p>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Arbitration fee:</strong>{' '}
                      {arbitrationFee && ethers.utils.formatEther(arbitrationFee.toString())} MATIC
                    </p>
                    <div className={'text-sm text-gray-500 mt-2'}>
                      <strong>Buyer fee:</strong>{' '}
                      {transaction?.senderFeePaidAt ? (
                        <span className='text-green-600 font-bold'>Paid</span>
                      ) : (
                        <span className='text-red-600 font-bold'>Not paid</span>
                      )}
                    </div>
                    <p className={'text-sm text-gray-500 mt-2'}>
                      <strong>Seller fee:</strong>{' '}
                      {transaction?.receiverFeePaidAt ? (
                        <span className='text-green-600 font-bold'>Paid</span>
                      ) : (
                        <span className='text-red-600 font-bold'>Not paid</span>
                      )}
                    </p>
                  </div>
                  {transaction &&
                    (transaction.status === TransactionStatusEnum.WaitingReceiver ||
                      transaction.status === TransactionStatusEnum.WaitingSender) && (
                      <>
                        <div className={'flex flex-col'}>
                          <div className={'flex flex-row'}>
                            {(transaction.status === TransactionStatusEnum.WaitingReceiver ||
                              transaction.status === TransactionStatusEnum.WaitingSender) && (
                              //TODO Remove subtraction
                              <TimeOutCountDown targetDate={getTargetDate() - 777600000} />
                            )}
                          </div>
                          <DisputeButton
                            isSender={isSender()}
                            isReceiver={isReceiver()}
                            // transactionStatus={TransactionStatusEnum.Resolved}
                            transactionStatus={transaction.status}
                            disabled={getTargetDate() > Date.now()}
                            payArbitrationFee={payFee}
                            arbitrationFeeTimeout={timeout}
                          />
                        </div>
                      </>
                    )}
                </div>
              </div>
              {account?.isConnected &&
                user &&
                transactionId &&
                signer &&
                provider &&
                transaction?.status !== TransactionStatusEnum.Resolved && (
                  <EvidenceForm transactionId={transactionId} signer={signer} provider={provider} />
                )}
              {transaction?.status === TransactionStatusEnum.NoDispute &&
                signer &&
                arbitrationFee && (
                  <div className={'flex w-full space-y-4 flex-raw pb-4'}>
                    <button
                      className={`ml-2 mt-4 px-5 py-2 block hover:text-white rounded-lg text-center text-red-600 bg-red-50 hover:bg-red-500`}
                      type='button'
                      onClick={() => payFee()}>
                      Raise dispute
                    </button>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dispute;
