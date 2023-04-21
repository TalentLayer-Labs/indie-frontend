import { useBlockNumber, useFeeData, useNetwork } from 'wagmi';

function SideBottom() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: feeData } = useFeeData({ watch: true });
  const network = useNetwork();

  return (
    <div className='flex flex-shrink-0 p-4 border-r border-gray-200'>
      <div className='group block w-full flex-shrink-0'>
        <div className='flex items-center'>
          <div className=''>
            <a
              href={`https://${
                network?.chain?.name == 'Ethereum' ? 'www' : network?.chain?.name.toLowerCase()
              }.etherscan.io/block/${blockNumber}`}
              target='_blank'
              className='text-xs font-medium text-zinc-100 flex items-center'>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  minHeight: '8px',
                  minWidth: '8px',
                  borderRadius: '50%',
                  position: 'relative',
                  marginRight: '4px',
                  backgroundColor: 'rgb(118, 209, 145)',
                  transition: 'background-color 250ms ease 0s',
                }}></span>
              {blockNumber} -{' '}
              <span className='flex'>
                <svg
                  width={10}
                  className='text-white mx-1'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 296.114 296.114'>
                  <path
                    fill='currentColor'
                    d='M277.66 20.815a9.85 9.85 0 0 0-9.845 9.844V41.66c-1.312-.381-2.667-.647-4.104-.647-8.156 0-14.765 6.608-14.765 14.764v36.091c0 4.359 1.923 8.232 4.922 10.933v94.065a9.86 9.86 0 0 1-9.844 9.844 9.86 9.86 0 0 1-9.843-9.844v-36.911c0-15.443-11.953-28.008-27.068-29.281V29.531C207.113 13.246 193.867 0 177.583 0H38.142C21.86 0 8.612 13.246 8.612 29.531v237.054c0 16.284 13.248 29.529 29.53 29.529h139.44c16.284 0 29.53-13.245 29.53-29.529V150.609c4.205 1.116 7.383 4.791 7.383 9.345v36.911c0 16.284 13.244 29.529 29.528 29.529s29.529-13.245 29.529-29.529V102.8c2.999-2.7 4.923-6.573 4.923-10.933v-15.75c5.031-.437 9.026-4.532 9.026-9.68V30.659c.002-5.434-4.407-9.844-9.841-9.844zm-101.233 94.278H39.298V31.864h137.129v83.229z'
                  />
                </svg>
                {feeData?.formatted.gasPrice
                  ? Math.round(parseInt(feeData?.formatted.gasPrice) / 10 ** 8) / 10
                  : ''}{' '}
                Gwei
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBottom;
