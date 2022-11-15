import { Contract, ethers, Signer } from 'ethers';
import TalentLayerMultipleArbitrableTransaction from './ABI/TalentLayerMultipleArbitrableTransaction.json';
import ERC20 from './ABI/ERC20.json';
import { toast } from 'react-toastify';
import { Provider } from '@web3modal/ethereum';
import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { config } from '../config';
import TransactionToast from '../components/TransactionToast';

export const validateProposal = async (
  signer: Signer,
  provider: Provider,
  serviceId: string,
  proposalId: string,
  rateToken: string,
  value: ethers.BigNumber,
): Promise<void> => {
  const talentLayerMultipleArbitrableTransaction = new Contract(
    '0x64A705B5121F005431574d3F23159adc230B0041',
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  try {
    if (rateToken === ethers.constants.AddressZero) {
      const tx1 = await talentLayerMultipleArbitrableTransaction.createETHTransaction(
        config.escrowConfig.timeoutPayment,
        'meta_evidence',
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        {
          value,
        },
      );

      const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
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
      const ERC20Token = new Contract(rateToken, ERC20.abi, signer);

      const balance = await ERC20Token.balanceOf(signer.getAddress());
      if (balance.lt(value)) {
        throw new Error('Insufficient balance');
      }

      const allowance = await ERC20Token.allowance(
        signer.getAddress(),
        '0x64A705B5121F005431574d3F23159adc230B0041',
      );

      if (allowance.lt(value)) {
        const tx1 = await ERC20Token.approve('0x64A705B5121F005431574d3F23159adc230B0041', value);
        const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
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

      const tx2 = await talentLayerMultipleArbitrableTransaction.createTokenTransaction(
        config.escrowConfig.timeoutPayment,
        'meta_evidence',
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
      );
      const receipt2 = await toast.promise(provider.waitForTransaction(tx2.hash), {
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
    let errorMessage;
    if (typeof error?.code === 'string') {
      const parsedEthersError = getParsedEthersError(error as EthersError);
      errorMessage = `${parsedEthersError.errorCode} - ${parsedEthersError.context}`;
    } else {
      errorMessage = error?.message;
    }
    toast.error(errorMessage);
  }
};
