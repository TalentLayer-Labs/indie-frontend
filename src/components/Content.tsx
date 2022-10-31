export default function Content() {
  return (
    <div className='bg-white'>
      <main>
        {/* Alternating Feature Sections */}
        <div className='relative overflow-hidden pt-16 pb-32'>
          <div
            aria-hidden='true'
            className='absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100'
          />
          <div className='relative'>
            <div className='lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8'>
              <div className='mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0'>
                <div>
                  <div className='mt-6'>
                    <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
                      Ready to use Web3 boilerplate
                    </h2>
                    <p className='mt-4 text-lg text-gray-500'>
                      Semper curabitur ullamcorper posuere nunc sed. Ornare iaculis bibendum
                      malesuada faucibus lacinia porttitor. Pulvinar laoreet sagittis viverra duis.
                      In venenatis sem arcu pretium pharetra at. Lectus viverra dui tellus ornare
                      pharetra.
                    </p>
                    <div className='mt-6'>
                      <a
                        href='#'
                        className='inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700'>
                        Launch Dapp
                      </a>
                    </div>
                  </div>
                </div>
                <div className='mt-8 border-t border-gray-200 pt-6'>
                  <blockquote>
                    <div>
                      <p className='text-base text-gray-500'>
                        &ldquo;Cras velit quis eros eget rhoncus lacus ultrices sed diam. Sit orci
                        risus aenean curabitur donec aliquet. Mi venenatis in euismod ut.&rdquo;
                      </p>
                    </div>
                    <footer className='mt-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex-shrink-0'>
                          <img
                            className='h-6 w-6 rounded-full'
                            src='https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
                            alt=''
                          />
                        </div>
                        <div className='text-base font-medium text-gray-700'>
                          John Doe, Digital Marketing Manager
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className='mt-12 sm:mt-16 lg:mt-0'>
                <div className='-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0'>
                  <img
                    className='w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none'
                    src='https://tailwindui.com/img/component-images/inbox-app-screenshot-1.jpg'
                    alt='Inbox user interface'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='mt-24'>
            <div className='lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8'>
              <div className='mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0'>
                <div>
                  <div className='mt-6'>
                    <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
                      Semper curabitur ullamcorper posuere
                    </h2>
                    <p className='mt-4 text-lg text-gray-500'>
                      Semper curabitur ullamcorper posuere nunc sed. Ornare iaculis bibendum
                      malesuada faucibus lacinia porttitor. Pulvinar laoreet sagittis viverra duis.
                      In venenatis sem arcu pretium pharetra at. Lectus viverra dui tellus ornare
                      pharetra.
                    </p>
                    <div className='mt-6'>
                      <a
                        href='#'
                        className='inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700'>
                        Get started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-12 sm:mt-16 lg:col-start-1 lg:mt-0'>
                <div className='-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0'>
                  <img
                    className='w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none'
                    src='https://tailwindui.com/img/component-images/inbox-app-screenshot-2.jpg'
                    alt='Customer profile user interface'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
