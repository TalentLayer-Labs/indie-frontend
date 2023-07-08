import { useState } from 'react';
import useMagic from './hooks/useMagic';

const ShowUIButton = () => {
  // Initialize state variable to decide whether to show button or not
  const [showButton, setShowButton] = useState(false);
  const { magic } = useMagic();

  // Define a function to check the type of the wallet
  // const checkWalletType = async () => {
  //   try {
  //     // Fetch the wallet's information using Magic's user.getInfo method
  //     const walletInfo = await magic?.user.getInfo();
  //     console.log('walletInfo', walletInfo);
  //
  //     /*TODO: Wallet info renvoie "Metamask" au lieu de "magic", alors que c'est bien "magic" qui est utilisé
  //      Le bouton showUi marche bien*/
  //
  //     // Determine if the wallet type is "magic"
  //     // const isMagicWallet = walletInfo?.walletType === 'magic';
  //     //
  //     // // Set 'showButton' state based on the result of the check
  //     // setShowButton(isMagicWallet);
  //     setShowButton(true);
  //   } catch (error) {
  //     // Log any errors that occur during the wallet type check process
  //     console.error('checkWalletType:', error);
  //   }
  // };

  // useEffect(() => {
  //   // Call the checkWalletType function
  //   checkWalletType();
  // }, [magic]);

  // Define the event handler for the button click
  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      const walletInfo = await magic?.user.getInfo();
      console.log('walletInfo', walletInfo);
      await magic?.wallet.showUI();
    } catch (error) {
      // Log any errors that occur during the process
      console.error('handleShowUI:', error);
    }
  };

  // Render the button component if showButton is true, otherwise render nothing
  return <button onClick={handleShowUI}>Show UI</button>;
  // return showButton ? <button onClick={handleShowUI}>Show UI</button> : null;
};

export default ShowUIButton;
