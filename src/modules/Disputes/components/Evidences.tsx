import EvidenceModal from './EvidenceModal';
import { IEvidence } from '../../../types';

function Evidences({
  evidences,
  partyHandle,
  title,
}: {
  evidences: IEvidence[];
  title: string;
  partyHandle?: string;
}) {
  return (
    <>
      <p className={'text-sm text-gray-500 mt-2 font-bold mb-1'}>{title}</p>
      <p className={'ml-2 text-sm text-gray-500'}>
        {evidences.length > 0 &&
          evidences.map(evidence => {
            return (
              evidence.description && (
                <EvidenceModal
                  id={evidence.id}
                  partyHandle={partyHandle ? partyHandle : evidence.party.handle}
                  name={evidence.description?.name}
                  description={evidence.description?.description}
                  fileTypeExtension={evidence.description?.fileTypeExtension}
                  fileHash={evidence.description?.fileHash}
                />
              )
            );
          })}
      </p>
    </>
  );
}

export default Evidences;
