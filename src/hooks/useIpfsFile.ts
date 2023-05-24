import { useState, useEffect } from 'react';
import { readFileFromIpfs } from '../utils/ipfs';

const useIpfsFile = (cid: false | string): any => {
  const [file, setFile] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('cid', cid);
      try {
        if (!cid) {
          return;
        }
        const response = await readFileFromIpfs(cid);
        if (response) {
          setFile(response);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [cid]);

  return file;
};

export default useIpfsFile;
