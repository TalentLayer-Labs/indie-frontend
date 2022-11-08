import { Contract, ethers, Signer } from 'ethers';
import { CONST } from '../constants';
import TalentLayerMultipleArbitrableTransaction from './TalentLayerMultipleArbitrableTransaction.json';
import ERC20 from './ERC20.json';
import { toast } from 'react-toastify';
import { Provider } from '@web3modal/ethereum';
import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';

export const acceptProposal = async (
  signer: Signer,
  provider: Provider,
  serviceId: string,
  proposalId: string,
  rateToken: string,
  rateAmount: string,
): Promise<void> => {
  const talentLayerMultipleArbitrableTransaction = new Contract(
    '0x64A705B5121F005431574d3F23159adc230B0041',
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  try {
    if (rateToken === CONST.ETH_ADDRESS) {
      const value = ethers.utils
        .parseUnits(rateAmount, 'wei')
        .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 'wei'));

      console.log({
        timeout: CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
        adminWallet: CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
        adminFee: CONST.KLEROS_TRANSACTION_ADMIN_FEE,
        serviceId: parseInt(serviceId, 10),
        proposalId: proposalId,
        value: value.toString(),
      });

      const tx1 = await talentLayerMultipleArbitrableTransaction.createETHTransaction(
        CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
        'meta_evidence',
        CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
        CONST.KLEROS_TRANSACTION_ADMIN_FEE,
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        {
          value,
        },
      );

      const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
        pending: 'Your validation is in progress',
        success: 'Transaction validated',
        error: 'An error occurred while updating your profile',
      });
      if (receipt1.status !== 1) {
        throw new Error('Approve Transaction failed');
      }
    } else {
      // Token transfer approval for escrow contract
      console.log('test', { rateToken });
      const ERC20Token = new Contract(rateToken, ERC20.abi, signer);
      const value = ethers.utils
        .parseUnits(rateAmount, 0)
        // unitName is set to "0" to parse to smallest unit of token
        .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 0));
      console.log(value.toString());

      // TODO: Check if balance and allowance are enough
      const balance = await ERC20Token.balanceOf(signer.getAddress());
      console.log(balance.toString());

      if (balance.lt(value)) {
        throw new Error('Unsufficient balance');
      }

      const allowance = await ERC20Token.allowance(
        signer.getAddress(),
        '0x64A705B5121F005431574d3F23159adc230B0041',
      );
      console.log(allowance.toString());

      if (allowance.lt(value)) {
        const tx1 = await ERC20Token.approve('0x64A705B5121F005431574d3F23159adc230B0041', value);
        const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
          pending: 'Your Approve transaction is pending',
          success: 'Transaction validated',
          error: 'An error occurred while updating your profile',
        });
        if (receipt1.status !== 1) {
          throw new Error('Approve Transaction failed');
        }
      }

      const tx2 = await talentLayerMultipleArbitrableTransaction.createTokenTransaction(
        CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
        'meta_evidence',
        CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
        CONST.KLEROS_TRANSACTION_ADMIN_FEE,
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
      );
      const receipt2 = await toast.promise(provider.waitForTransaction(tx2.hash), {
        pending: 'Your validation is in progress',
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
