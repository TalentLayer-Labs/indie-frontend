import { useState, useEffect } from 'react';
import { readFromIpfs } from '../utils/ipfs';

const useIpfsJsonData = (cid: false | string): any => {
  const [file, setFile] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!cid) {
          return;
        }
        const response = await readFromIpfs(cid);
        console.log('response', response);
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

export default useIpfsJsonData;
