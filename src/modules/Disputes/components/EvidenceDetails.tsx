import MetaEvidenceModal from './MetaEvidenceModal';
import useEvidences from '../../../hooks/useEvidences';
import { IProposal, ITransaction } from '../../../types';
import Evidences from './Evidences';

function EvidenceDetails({
  transaction,
  proposal,
}: {
  transaction: ITransaction;
  proposal: IProposal;
}) {
  const evidences = useEvidences(transaction.id);

  const buyerEvidences = evidences.filter(
    evidence => evidence.party.id === proposal?.service.buyer.id,
  );
  const sellerEvidences = evidences.filter(evidence => evidence.party.id === proposal?.seller.id);
  return (
    <div className={'flex-col flex'}>
      <Evidences
        evidences={buyerEvidences}
        partyHandle={proposal.service.buyer.handle}
        title={'Buyer evidences: '}
      />
      <Evidences evidences={sellerEvidences} title={'Seller evidences: '} />
      {transaction.receiver && proposal.service && proposal.description && (
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
  );
}

export default EvidenceDetails;
