import { useState } from 'react';

const useCopyToClipboard = (): [boolean, (text: string) => Promise<void>] => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      console.warn('Copy failed', error);
      setIsCopied(false);
    }
  };

  return [isCopied, copyToClipboard];
};

export default useCopyToClipboard;
