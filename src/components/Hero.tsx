import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className='bg-white'>
      {/* Hero section */}
      <div className='relative'>
        <div className='absolute inset-x-0 bottom-0 h-1/2 bg-white' />
        <div className='mx-auto py-10 max-w-7xl sm:px-6 lg:px-8'>
          <div className='relative shadow-xl sm:overflow-hidden sm:rounded-2xl'>
            <div className='absolute inset-0'>
              <img
                className='h-full w-full object-cover'
                src='https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100'
                alt='People working on laptops'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply' />
            </div>
            <div className='relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8'>
              <h1 className='text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
                <span className='block text-white'>Launch your Dapp in one click</span>
                <span className='block text-indigo-200'>web3-boilerplate</span>
              </h1>
              <p className='mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl'>
                Please read the boilerplate documentation
              </p>
              <div className='mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center'>
                <div className='space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0'>
                  <Link
                    to='/dashboard'
                    className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8'>
                    Dashboard
                  </Link>
                  <a
                    href='https://github.com/0xRomain/web3-boilerplate'
                    className='flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8'>
                    Github
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
