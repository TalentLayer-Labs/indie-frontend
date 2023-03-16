import { ZkConnect, ZkConnectClient, ZkConnectClientConfig } from '@sismo-core/zk-connect-client';
// import {
//   ZkConnect as zkConnectServer,
//   DataRequest,
//   ZkConnectServerConfig,
// } from '@sismo-core/zk-connect-server';
import { postToIPFS } from '../utils/ipfs';
import { ethers } from 'ethers';
import { config } from '../config';
import TalentLayerID from '../contracts/ABI/TalentLayerID.json';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';
import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { getUserDescription } from '../queries/users';
import { useProvider, useSigner } from 'wagmi';

function Sismo() {
  const { user } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });

  const zkConnectClientConfig: ZkConnectClientConfig = {
    appId: '0xd219015f6e733c03211d2d8aeefe6041',
    devMode: {
      enabled: true,
    },
    // appId: import.meta.env.VITE_ZK_CONNECT_APP_ID,
  };

  //TODO /!\ This need a backend
  // const zkConnectServerConfig: ZkConnectServerConfig = {
  //   appId: '0xd219015f6e733c03211d2d8aeefe6041',
  //   devMode: {
  //     enabled: true,
  //   },
  //   // appId: import.meta.env.VITE_ZK_CONNECT_APP_ID,
  // };

  const zkConnectClient = ZkConnect(zkConnectClientConfig);

  const handleConnectToVault = async (): Promise<void> => {
    // Redirect to Sismo Vault + creates Proof (in URL for now)
    zkConnectClient.request();

    // Get proof from URL
    const zkConnectResponse = zkConnectClient.getResponse();

    // //Verify proof with server
    // const TALENTLAYER_USERS_REQUEST = DataRequest({
    //   groupId: 'XXXX',
    // });
    //
    // const server = zkConnectServer(zkConnectServerConfig);
    // if (zkConnectResponse) {
    //   const { vaultId } = await server.verify(
    //     zkConnectResponse,
    //     // , {
    //     // dataRequest: TALENTLAYER_USERS_REQUEST, //requestedValue
    //     // }
    //   );
    //
    //   if (vaultId && user?.address && signer && provider) {
    //     const userData = await getUserDescription(user.address);
    //     try {
    //       const cid = await postToIPFS(
    //         JSON.stringify({
    //           title: userData.title,
    //           role: userData.role,
    //           name: userData.name,
    //           about: userData.about,
    //           skills: userData.skills_raw,
    //           sismoVaultId: vaultId,
    //         }),
    //       );
    //
    //       const contract = new ethers.Contract(
    //         config.contracts.talentLayerId,
    //         TalentLayerID.abi,
    //         signer,
    //       );
    //
    //       const tx = await contract.fileData(user.id, cid);
    //       await createMultiStepsTransactionToast(
    //         {
    //           pending: 'Updating profile...',
    //           success: 'Congrats! Your profile has been updated',
    //           error: 'An error occurred while updating your profile',
    //         },
    //         provider,
    //         tx,
    //         'user',
    //         cid,
    //       );
    //     } catch (error) {
    //       showErrorTransactionToast(error);
    //     }
    //   }
    // }
  };

  return (
    <div className='items-center justify-center content-center justify-items-center'>
      <button
        onClick={() => handleConnectToVault()}
        className='block text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'
        type='button'>
        Connect to Sismo Vault
      </button>
    </div>
  );
}

export default Sismo;
