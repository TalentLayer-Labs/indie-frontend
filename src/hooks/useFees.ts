import { useState, useEffect } from 'react';
import { IFees } from '../types';
import { ethers } from 'ethers';
import { config } from '../config';
import TalentLayerMultipleArbitrableTransaction from '../contracts/ABI/TalentLayerMultipleArbitrableTransaction.json';
import TalentLayerPlatformID from '../contracts/ABI/TalentLayerPlatformID.json';
import { useSigner } from '@web3modal/react';

const useFees = (): IFees => {
  const [signerLoaded, setSignerLoaded] = useState(false);
  const [fees, setFees] = useState({
    // protocolFeeRate: '',
    // originPlatformFeeRate: '',
    // platformFeeRate: '',
    protocolFeeRate: ethers.BigNumber.from('0'),
    originPlatformFeeRate: ethers.BigNumber.from('0'),
    platformFeeRate: ethers.BigNumber.from('0'),
  });
  const { data: signer, refetch: refetchSigner } = useSigner();

  const klerosContract = new ethers.Contract(
    config.contracts.TalentLayerMultipleArbitrableTransaction,
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  const talentLayerPlatformIdContract = new ethers.Contract(
    config.contracts.talentLayerPlatformId,
    TalentLayerPlatformID.abi,
    signer,
  );

  useEffect(() => {
    const loadContracts = async () => {
      await refetchSigner({ chainId: 5 });
      console.log('Signer Loaded');
      setSignerLoaded(true);
      // }
    };
    loadContracts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (klerosContract && talentLayerPlatformIdContract && signerLoaded) {
          const protocolFee = await klerosContract.protocolFee();
          const originPlatformFee = await klerosContract.originPlatformFee();
          const platformData = await talentLayerPlatformIdContract.platforms(
            import.meta.env.VITE_NETWORK_ID,
          );
          if (!!protocolFee && !!originPlatformFee && !!platformData) {
            // console.log('all true', protocolFee && originPlatformFee && platformData);
            setFees({
              // protocolFeeRate: protocolFee,
              // originPlatformFeeRate: originPlatformFee,
              // platformFeeRate: platformData.fee,
              protocolFeeRate: ethers.BigNumber.from(protocolFee),
              originPlatformFeeRate: ethers.BigNumber.from(originPlatformFee),
              platformFeeRate: ethers.BigNumber.from(platformData.fee),
            });
          }
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [signerLoaded]);
  //TODO: Why does this get called so many times ?
  // console.log('return');
  return fees;
};

export default useFees;
