/* eslint-disable no-console */
import { create, IPFSHTTPClient } from 'ipfs-http-client';

export const postToIPFS = async (data: any): Promise<string> => {
  let ipfs: IPFSHTTPClient | undefined;
  let cid = '';
  try {
    const authorization =
      'Basic ' + btoa(import.meta.env.VITE_INFURA_ID + ':' + import.meta.env.VITE_INFURA_SECRET);
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
  return new Promise<boolean>(async (resolve, reject) => {
    const interval = setInterval(async () => {
      const response = await fetch(cid);
      const data = await response.json();
      if (data) {
        clearInterval(interval);
        resolve(true);
      }
    }, 5000);
  });
};
