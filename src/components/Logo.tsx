export default function Logo() {
  return (
    <div className='bg-white'>
      <main>
        {/* Logo Cloud */}
        <div className='bg-gray-100'>
          <div className='mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8'>
            <p className='text-center text-base font-semibold text-gray-500'>
              Your amazing logo partners
            </p>
            <div className='mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5'>
              <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
                <img
                  className='h-12'
                  src='https://tailwindui.com/img/logos/tuple-logo-gray-400.svg'
                  alt='Tuple'
                />
              </div>
              <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
                <img
                  className='h-12'
                  src='https://tailwindui.com/img/logos/mirage-logo-gray-400.svg'
                  alt='Mirage'
                />
              </div>
              <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
                <img
                  className='h-12'
                  src='https://tailwindui.com/img/logos/statickit-logo-gray-400.svg'
                  alt='StaticKit'
                />
              </div>
              <div className='col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1'>
                <img
                  className='h-12'
                  src='https://tailwindui.com/img/logos/transistor-logo-gray-400.svg'
                  alt='Transistor'
                />
              </div>
              <div className='col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1'>
                <img
                  className='h-12'
                  src='https://tailwindui.com/img/logos/workcation-logo-gray-400.svg'
                  alt='Workcation'
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
