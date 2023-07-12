import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import TalentLayerContext from '../../context/talentLayer';

const ShowUIButton = () => {
  const [showButton, setShowButton] = useState(false);
  const { magicProvider } = useContext(TalentLayerContext);
  const { connector } = useAccount();

  const checkWalletType = async () => {
    try {
      const walletInfo = await magicProvider?.magic?.user.getInfo();
      console.log('walletInfo', walletInfo);
      const isMagicWallet = walletInfo?.walletType === 'magic';
      // const isMagicWallet = connector === 'magic';
      setShowButton(isMagicWallet);
    } catch (error) {
      // Log any errors that occur during the wallet type check process
      console.error('checkWalletType:', error);
    }
  };

  useEffect(() => {
    checkWalletType();
  }, [magicProvider?.magic]);

  const handleShowUI = async () => {
    try {
      const walletInfo = await magicProvider?.magic?.user.getInfo();
      console.log('walletInfo', walletInfo);
      // await magic?.wallet.showUI();
    } catch (error) {
      console.error('handleShowUI:', error);
    }
  };

  // Render the button component if showButton is true, otherwise render nothing
  return showButton && <button onClick={handleShowUI}>Show UI</button>;
};

export default ShowUIButton;
