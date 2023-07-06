import { ethers } from 'ethers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { usePublicClient, useWalletClient } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import { createTalentLayerIdTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import HelpPopover from '../HelpPopover';
import SubmitButton from './SubmitButton';
import { HandlePrice } from './handle-price';
import { delegateMintID } from '../request';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { polygonMumbai } from '@wagmi/core/chains';
import useMagic from '../../modules/Magic/hooks/useMagic';
import Web3 from 'web3';

interface IFormValues {
  handle: string;
}

const initialValues: IFormValues = {
  handle: '',
};

function TalentLayerIdForm() {
  const { user, account } = useContext(TalentLayerContext);
  const { data: signer } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = usePublicClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });
  const walletClient =
    typeof window !== 'undefined'
      ? createWalletClient({
          chain: polygonMumbai,
          transport: custom(window.ethereum),
        })
      : undefined;
  const router = useRouter();

  const { magic, provider: magicProvider } = useMagic();

  const web3 = new Web3(magic?.rpcProvider);

  const validationSchema = Yup.object().shape({
    handle: Yup.string()
      .min(2)
      .max(10)
      .matches(/^[a-z0-9][a-z0-9-_]*$/, 'Only a-z, 0-9 and -_ allowed, and cannot begin with -_')
      .when('isConnected', {
        is: account && account.isConnected,
        then: schema => schema.required('handle is required'),
      }),
  });

  const onSubmit = async (
    submittedValues: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (
      // account && account.address && account.isConnected && signer &&
      provider &&
      walletClient
    ) {
      console.log('submittedValues', submittedValues);
      try {
        // const contract = new ethers.Contract(
        //   config.contracts.talentLayerId,
        //   TalentLayerID.abi,
        //   signer,
        // );

        // const handlePrice = await contract.getHandlePrice(submittedValues.handle);

        // const web3 = new Web3(provider);

        const handlePrice = await provider.readContract({
          address: config.contracts.talentLayerId,
          abi: TalentLayerID.abi,
          functionName: 'getHandlePrice',
          args: [submittedValues.handle],
        });
        console.log('getHandlePrice', handlePrice);

        if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT === 'true') {
          const response = await delegateMintID(
            submittedValues.handle,
            handlePrice,
            account.address,
          );
          const tx = response.data.transaction;
        } else {
          // tx = await contract.mint(process.env.NEXT_PUBLIC_PLATFORM_ID, submittedValues.handle, {
          //   value: handlePrice,
          // });
          // const [address] = await walletClient.getAddresses();

          // const walletInfo = await magic?.user.getInfo();
          // const address = walletInfo?.publicAddress;
          // console.log('walletClient address', address);

          //TODO => Will open Metamask
          // const resp = await window.ethereum.request({
          //   method: 'eth_requestAccounts',
          // });
          // console.log('resp', resp);

          const contract = new web3.eth.Contract(TalentLayerID.abi, config.contracts.talentLayerId);

          console.log('contract.methods',contract?.methods);
          //TODO test simple send

          web3.eth
            .sendTransaction({
              from: account?.address,
              to: config.contracts.talentLayerId,
              value: handlePrice,
              gas: 2100000,
              data: contract.methods
                .mint(process.env.NEXT_PUBLIC_PLATFORM_ID, submittedValues.handle)
                .encodeABI(),
            })
            .on('transactionHash', hash => {
              console.log('Transaction hash:', hash);
            })
            .then(receipt => {
              console.log('Transaction receipt:', receipt);
            })
            .catch(error => {
              console.error('error sending with web3.js',error);
            });

          // const { request } = await publicClient.simulateContract({
          //   address: config.contracts.talentLayerId,
          //   abi: TalentLayerID.abi,
          //   functionName: 'mint',
          //   account: address,
          //   args: [process.env.NEXT_PUBLIC_PLATFORM_ID, submittedValues.handle],
          //   value: handlePrice as string,
          // });
          //
          // const tx = await walletClient.writeContract(request);
        }
        // await createTalentLayerIdTransactionToast(
        //   {
        //     pending: 'Minting your Talent Layer Id...',
        //     success: 'Congrats! Your Talent Layer Id is minted',
        //     error: 'An error occurred while creating your Talent Layer Id',
        //   },
        //   provider,
        //   tx,
        //   account.address,
        // );

        setSubmitting(false);
        // TODO: add a refresh function on TL context and call it here rather than hard refresh
        // router.reload();
      } catch (error: any) {
        showErrorTransactionToast(error);
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, values }) => (
        <Form>
          <div className='flex divide-x bg-white py-4 px-4 mb-2 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded-lg'>
            <div className='sm:px-6 flex flex-row items-center gap-2'>
              <span className='text-gray-500 hidden md:block'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                  />
                </svg>
              </span>
              <Field
                type='text'
                className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg border-0'
                placeholder='Choose your handle'
                id='handle'
                name='handle'
                required
              />
            </div>

            <div className='flex items-center'>
              {values.handle && <HandlePrice handle={values.handle} />}
              <div>
                <div className='sm:pl-2 sm:pr-4 sm:space-x-4 relative'>
                  <SubmitButton isSubmitting={isSubmitting} />
                  <HelpPopover>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      What is a TalentLayerID?
                    </h3>
                    <p>
                      TalentLayer ID is a work identity that allows ownership and growth of
                      reputation across many gig marketplaces. TalentLayer IDs are ERC-721 NFTs that
                      live inside crypto wallets; this means that reputation is self-custodied by
                      the wallet owner and lives separately from integrated platforms.
                    </p>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      What is the handle?
                    </h3>
                    <p>
                      Your TalentLayer ID Handle is a unique string of characters and numbers that
                      you can choose when you create your TalentLayer ID. This handle is how others
                      can search for your reputation. You can have a maximum of 10 characters in
                      your TalentLayer ID.
                    </p>
                    <a
                      target='_blank'
                      href='https://docs.talentlayer.org/basics/elements/what-is-talentlayer-id'
                      className='flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700'>
                      Read more{' '}
                      <svg
                        className='w-4 h-4 ml-1'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fillRule='evenodd'
                          d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                          clipRule='evenodd'></path>
                      </svg>
                    </a>
                  </HelpPopover>
                </div>
              </div>
            </div>
          </div>
          <span className='label-text text-red-500 mt-2'>
            <ErrorMessage name='handle' />
          </span>
        </Form>
      )}
    </Formik>
  );
}

export default TalentLayerIdForm;
