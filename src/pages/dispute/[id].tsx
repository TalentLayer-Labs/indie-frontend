import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import EvidenceForm from '../../components/Form/EvidenceForm';
import { TransactionStatusEnum } from '../../types';
import useTransactionsById from '../../hooks/useTransactionsById';
import TimeOutCountDown from '../../components/TimeoutCountDown';
import DisputeButton from '../../components/DisputeButton';
import useArbitrationCost from '../../hooks/useArbitrationCost';
import { ethers } from 'ethers';
import useEvidences from '../../hooks/useEvidences';
import { useProvider, useSigner } from 'wagmi';
import { arbitrationFeeTimeout, payArbitrationFee } from '../../contracts/disputes';
import MetaEvidenceModal from '../../modules/Kleros/components/MetaEvidenceModal';
import { formatRateAmount } from '../../utils/web3';
import Steps from '../../components/Steps';
import EvidenceModal from '../../modules/Kleros/components/EvidenceModal';

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

  if (
    user &&
    proposal &&
    proposalId &&
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

  const isSender = (): boolean => {
    return !!user && !!transaction && user.id === transaction.sender.id;
  };

  const isReceiver = (): boolean => {
    return !!user && !!transaction && user.id === transaction.receiver.id;
  };

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

  const buyerEvidences = evidences.filter(
    evidence => evidence.party.id === proposal?.service.buyer.id,
  );
  const sellerEvidences = evidences.filter(evidence => evidence.party.id === proposal?.seller.id);

  const payFee = () => {
    if (signer && user && transactionId && arbitrationFee) {
      const isUserSender = isSender();

      return payArbitrationFee(
        signer,
        provider,
        arbitrationFee,
        isUserSender,
        transactionId,
        router,
      );
    }
  };
  const timeout = () => {
    if (signer && user && transactionId) {
      return arbitrationFeeTimeout(signer, provider, transactionId, router);
    }
  };

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
                        evidence.description && (
                          <EvidenceModal
                            id={evidence.id}
                            partyHandle={proposal?.service.buyer.handle}
                            name={evidence.description?.name}
                            description={evidence.description?.description}
                            fileTypeExtension={evidence.description?.fileTypeExtension}
                            fileHash={evidence.description?.fileHash}
                          />
                        )
                      );
                    })}
                </p>
                <p className={'text-sm text-gray-500 mt-4'}>
                  <strong>Seller evidences:</strong>
                  {evidences.length > 0 &&
                    sellerEvidences.map(evidence => {
                      return (
                        evidence.description && (
                          <EvidenceModal
                            id={evidence.id}
                            partyHandle={evidence.party.handle}
                            name={evidence.description?.name}
                            description={evidence.description?.description}
                            fileTypeExtension={evidence.description?.fileTypeExtension}
                            fileHash={evidence.description?.fileHash}
                          />
                        )
                      );
                    })}
                </p>
                {transaction &&
                  transaction.receiver &&
                  proposal &&
                  proposal.service &&
                  proposal.description && (
                    <p className={'text-sm text-gray-500 mt-4'}>
                      <strong>Meta evidence:</strong>
                      <MetaEvidenceModal
                        seller={transaction?.receiver}
                        serviceData={proposal?.service}
                        token={transaction.token}
                        proposalData={{
                          about: proposal?.description.about,
                          expirationDate: proposal.expirationDate,
                          rateAmount: proposal.rateAmount,
                          rateToken: proposal.rateToken.address,
                          videoUrl: proposal.description.video_url,
                        }}
                      />
                    </p>
                  )}
              </div>
              <div className={'flex flex-row h-min gap-2 border border-gray-200 rounded-xl p-4'}>
                <div className={''}>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Status:</strong> {transaction?.status}
                  </p>
                  <p className={'text-sm text-gray-500 mt-2'}>
                    <strong>Arbitration fee:</strong>{' '}
                    {arbitrationFee &&
                      transaction?.token &&
                      formatRateAmount(
                        arbitrationFee.toString(),
                        transaction?.token.address,
                        transaction?.token.decimals,
                      ).exactValue}{' '}
                    MATIC
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
                {transaction && (
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
                        transactionStatus={transaction.status}
                        disabled={getTargetDate() > Date.now()}
                        payArbitrationFee={payFee}
                        arbitrationFeeTimeout={timeout}
                      />
                      {transaction && transaction.ruling && (
                        <span className='mt-4 ml-2 text-xl font-bold text-gray-600'>
                          {transaction.ruling === 1 ? 'Sender Wins' : 'Receiver Wins'}
                        </span>
                      )}
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
        </>
      )}
    </div>
  );
}

export default Dispute;
