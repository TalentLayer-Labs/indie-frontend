import { useState } from 'react';
import { boolean } from 'yup';

interface ToggleProps {
  proposalConsent: boolean;
  setProposalConsent: (value: boolean) => void;
}

const Toggle = ({ proposalConsent, setProposalConsent }: ToggleProps) => {
  const toggle = () => {
    setProposalConsent(!proposalConsent);
    console.log(proposalConsent);
  };

  return (
    <>
      <button
        type='button'
        onClick={toggle}
        className={`${
          proposalConsent ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex items-center h-6 rounded-full w-11`}>
        <span
          className={`${
            proposalConsent ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
        />
      </button>
      <span className='ml-2'>Receive notification when someone send a proposal</span>
    </>
  );
};

export default Toggle;
