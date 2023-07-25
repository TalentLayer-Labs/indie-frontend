import { useState } from 'react';
import { boolean } from 'yup';

interface ToggleProps {
  consentsMgmt: boolean[];
  setConsentsMgmt: (value: boolean[]) => void;
  labels: string[];
}

const Toggle = ({ consentsMgmt, setConsentsMgmt, labels }: ToggleProps) => {
  const toggle = (index: number) => {
    const newConsents = [...consentsMgmt];
    newConsents[index] = !newConsents[index];
    setConsentsMgmt(newConsents);
  };

  return (
    <>
      {consentsMgmt.map((consent, index) => (
        <div key={index} className='flex items-center space-x-2 pb-4'>
          <button
            type='button'
            onClick={() => toggle(index)}
            className={`${
              consent ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11`}>
            <span
              className={`${
                consent ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
            />
          </button>
          <span className='ml-2'>{labels[index]}</span>
        </div>
      ))}
    </>
  );
};

export default Toggle;
