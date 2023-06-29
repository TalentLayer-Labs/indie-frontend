import { useState } from 'react';

const Toggle = () => {
  const [isToggled, setToggled] = useState(false);

  const toggle = () => {
    setToggled(!isToggled);
    console.log(isToggled);
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className={`${
        isToggled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11`}>
      <span
        className={`${
          isToggled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  );
};

export default Toggle;
