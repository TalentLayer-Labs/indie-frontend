import { useContext, useState } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import EvidenceForm from '../../components/Form/EvidenceForm';
import { TransactionStatusEnum } from '../../types';
import { Evidence } from '../../modules/Kleros/utils/types';
import { generateEvidence } from '../../modules/Kleros/utils/generateMetaEvidence';
import { postToIPFS } from '../../utils/ipfs';
import { ethers } from 'ethers';
import { config } from '../../config';
import TalentLayerEscrow from '../../contracts/ABI/TalentLayerEscrow.json';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import { useWeb3Modal } from '@web3modal/react';
import { useProvider, useSigner } from 'wagmi';

function Dispute() {
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const { open: openConnectModal } = useWeb3Modal();
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const proposal = useProposalById(proposalId as string);

  const [evidences, setEvidences] = useState<Evidence[]>([]);

  const transactionId = proposal?.service?.transaction?.id;

  const submitEvidences = async () => {
    if (account?.isConnected === true && provider && signer) {
      try {
        const fileCid = 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v';
        const evidence = generateEvidence(fileCid, evidences[0].name, evidences[0].description);
        const evidenceCid = await postToIPFS(JSON.stringify(evidence));

        const contract = new ethers.Contract(
          config.contracts.talentLayerEscrow,
          TalentLayerEscrow.abi,
          signer,
        );
        const tx = await contract.submitEvidence(user?.id, transactionId, evidenceCid);
        const newId = await createMultiStepsTransactionToast(
          {
            pending: 'Submitting evidence...',
            success: 'Congrats! Your evidence has been submitted',
            error: 'An error occurred while submitting your evidence ',
          },
          provider,
          tx,
          'evidence',
          evidenceCid,
        );
        if (newId) {
          router.reload();
        }
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  if (
    user &&
    proposal &&
    user.id !== proposal?.service.buyer.id &&
    user.id !== proposal?.seller.id
  ) {
    //TODO ID wrong, need to substring before "-"
    router.push(`/services/${proposalId}`);
  }

  if (!proposal?.service?.transaction?.id) {
    return <Loading />;
  }

  return (
    <>
      {proposal?.service.transaction.status === TransactionStatusEnum.NoDispute && (
        <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
          <p className='text-5xl font-medium tracking-wider mb-8'>
            Raise <span className='text-indigo-600'>a dispute</span>
          </p>
          <div className={'border border-gray-200 rounded-md p-8'}>
            <div className={'mb-4 pb-4 border-b border-b-gray-200'}>
              You are about to raise a dispute for the service{' '}
              {proposal?.service.description?.title}
            </div>
            <div className={'mb-4 pb-4 border-b border-b-gray-200'}>
              Here are the evidences you are about to submit:
              {evidences.map(evidence => (
                <div key={evidence.name}>
                  <div>{evidence.name}</div>
                  <div>{evidence.description}</div>
                  <div>{evidence.fileHash}</div>
                  <div>{evidence.fileTypeExtension}</div>
                </div>
              ))}
            </div>
            {account?.isConnected && user && (
              <>
                <EvidenceForm evidences={evidences} setEvidences={setEvidences} />
                <button
                  className={`px-5 py-2 border rounded-md 'hover:text-indigo-600 hover:bg-white border-indigo-600 text-white bg-indigo-700`}
                  onClick={() => {
                    submitEvidences();
                  }}>
                  Post Evidences
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Dispute;
