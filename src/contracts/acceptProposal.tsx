import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { ADDRESS_ZERO, config } from '../config';
import { showErrorTransactionToast } from '../utils/toast';
import ERC20 from './ABI/ERC20.json';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { PublicClient, WalletClient } from 'viem';

export const validateProposal = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  serviceId: string,
  proposalId: string,
  rateToken: string,
  cid: string,
  metaEvidenceCid: string,
  value: bigint,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    walletClient,
  );

  try {
    if (rateToken === ADDRESS_ZERO) {
      const tx1 = await talentLayerEscrow.createTransaction(
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        metaEvidenceCid,
        cid,
        {
          value,
        },
      );

      const receipt1 = await toast.promise(publicClient.waitForTransaction(tx1.hash), {
        pending: {
          render() {
            return (
              <TransactionToast
                message='Your validation is in progress'
                transactionHash={tx1.hash}
              />
            );
          },
        },
        success: 'Transaction validated',
        error: 'An error occurred while validating your transaction',
      });
      if (receipt1.status !== 1) {
        throw new Error('Approve Transaction failed');
      }
    } else {
      // Token transfer approval for escrow contract
      const ERC20Token = new Contract(rateToken, ERC20.abi, walletClient);

      const balance = await ERC20Token.balanceOf(walletClient.getAddress());
      if (balance.lt(value)) {
        throw new Error('Insufficient balance');
      }

      const allowance = await ERC20Token.allowance(
        walletClient.getAddress(),
        config.contracts.talentLayerEscrow,
      );

      if (allowance.lt(value)) {
        const tx1 = await ERC20Token.approve(config.contracts.talentLayerEscrow, value);
        const receipt1 = await toast.promise(publicClient.waitForTransaction(tx1.hash), {
          pending: {
            render() {
              return (
                <TransactionToast
                  message='Your approval is in progress'
                  transactionHash={tx1.hash}
                />
              );
            },
          },
          success: 'Transaction validated',
          error: 'An error occurred while updating your profile',
        });
        if (receipt1.status !== 1) {
          throw new Error('Approve Transaction failed');
        }
      }

      const tx2 = await talentLayerEscrow.createTransaction(
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        metaEvidenceCid,
        cid,
      );
      const receipt2 = await toast.promise(publicClient.waitForTransaction(tx2.hash), {
        pending: {
          render() {
            return (
              <TransactionToast
                message='Your validation is in progress'
                transactionHash={tx2.hash}
              />
            );
          },
        },
        success: 'Transaction validated',
        error: 'An error occurred while updating your profile',
      });
      if (receipt2.status !== 1) {
        throw new Error('Transaction failed');
      }
    }
  } catch (error: any) {
    showErrorTransactionToast(error);
  }
};
