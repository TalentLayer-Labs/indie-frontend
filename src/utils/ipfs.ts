/* eslint-disable no-console */
import { create, IPFSHTTPClient } from 'ipfs-http-client';

export const postToIPFS = async (data: any): Promise<string> => {
  let ipfs: IPFSHTTPClient | undefined;
  let cid = '';
  try {
    const authorization =
      'Basic ' +
      btoa(process.env.NEXT_PUBLIC_INFURA_ID + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET);
    ipfs = create({
      url: 'https://infura-ipfs.io:5001/api/v0',
      headers: {
        authorization,
      },
    });
    const result = await (ipfs as IPFSHTTPClient).add(data);
    cid = `${result.path}`;
  } catch (error) {
    console.error('IPFS error ', error);
  }
  return cid;
};

export const IpfsIsSynced = async (cid: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const interval = setInterval(async () => {
      const response = await fetch(cid);
      if (response.status === 200) {
        clearInterval(interval);
        resolve(true);
      }
    }, 5000);
  });
};
