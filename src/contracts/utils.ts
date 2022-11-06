import { Contract, ethers, Signer } from 'ethers';
import { CONST } from '../constants';
import TalentLayerMultipleArbitrableTransaction from './TalentLayerMultipleArbitrableTransaction.json';
import ERC20 from './ERC20.json';

export const acceptProposal = async (
  signer: Signer,
  serviceId: string,
  sellerId: string,
  rateAmount: string,
  rateToken: string,
): Promise<void> => {
  const talentLayerMultipleArbitrableTransaction = new Contract(
    '0x64A705B5121F005431574d3F23159adc230B0041',
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  if (rateToken === CONST.ETH_ADDRESS) {
    const value = ethers.utils
      .parseUnits(rateAmount, 'wei')
      .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 'wei'));

    await talentLayerMultipleArbitrableTransaction.createETHTransaction(
      CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
      'meta_evidence',
      CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
      CONST.KLEROS_TRANSACTION_ADMIN_FEE,
      parseInt(serviceId, 10),
      parseInt(sellerId, 10),
      {
        value,
        gasLimit: 5000000,
      },
    );
  } else {
    // Token transfer approval for escrow contract
    const ERC20Token = new Contract(rateToken, ERC20.abi, signer);
    const value = ethers.utils
      .parseUnits(rateAmount, 0)
      // unitName is set to "0" to parse to smallest unit of token
      .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 0));

    await ERC20Token.approve('0x64A705B5121F005431574d3F23159adc230B0041', value);
    await talentLayerMultipleArbitrableTransaction.createTokenTransaction(
      CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
      'meta_evidence',
      CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
      CONST.KLEROS_TRANSACTION_ADMIN_FEE,
      parseInt(serviceId, 10),
      parseInt(sellerId, 10),
      {
        gasLimit: 5000000,
      },
    );
  }
};
