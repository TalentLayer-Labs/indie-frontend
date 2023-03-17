import { SetStateAction, useContext, useEffect, useState } from 'react';
import ProfileForm from '../components/Form/ProfileForm';
import TalentLayerIdForm from '../components/Form/TalentLayerIdForm';
import TalentLayerContext from '../context/talentLayer';

function Onboarding() {
  const { user } = useContext(TalentLayerContext);
  const [step, setStep] = useState(1);

  console.log({ user });

  useEffect(() => {
    if (user && step == 1) {
      setStep(2);
    }
  }, [user, step]);

  if (!user && step == 1) {
    return renderStep1();
  } else if (step == 2) {
    return renderStep2(setStep);
  } else if (step == 3) {
    return renderStep3(setStep);
  } else if (step == 4) {
    return renderStep4();
  }
}

const renderStep1 = () => {
  return (
    <div className='flex w-screen flex-wrap text-slate-800'>
      <div className='flex w-full flex-col md:w-1/2'>
        <div className='my-auto mx-auto flex flex-col justify-center px-3 pt-8 md:justify-start lg:w-[30rem]'>
          <img src='/zkpow/zkpow.webp' className='py-1 max-w-[220px]'></img>
          <p className='text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl'>
            Create Your <span className='text-purple-600'>Profile</span>
          </p>
          <p className='mt-6 text-center font-medium md:text-left'>
            Access job platforms in private with <br />
            zkPoW's Work Reputation Vault.
          </p>

          <div className='py-12 text-center'>
            <TalentLayerIdForm />
          </div>
        </div>
      </div>
      <div className='relative hidden h-screen select-none bg-purple-600 bg-gradient-to-br md:block md:w-1/2'>
        <div className='py-16 px-8 text-white xl:w-[40rem]'>
          <img src='/zkpow/hands.webp' className='pt-9 max-w-xs'></img>
          <p className='my-6 text-3xl font-semibold leading-10'>
            Your Work History{' '}
            <span className='abg-white whitespace-nowrap py-2 text-pink-300'>In Your Hands</span>.
          </p>
          <p className='mb-4'>Prove your work achievements without sacrificing your privacy.</p>
          {/* <a
            href='index.html'
            className='font-semibold tracking-wide text-white underline underline-offset-4'>
            Learn More
          </a> */}
        </div>
      </div>
    </div>
  );
};

const renderStep2 = (setStep: { (value: SetStateAction<number>): void; (arg0: number): void }) => {
  return (
    <div className='flex w-screen flex-wrap text-slate-800'>
      <div className='flex w-full flex-col md:w-1/2'>
        <div className='my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[30rem]'>
          <img src='/zkpow/zkpow.webp' className='py-1 max-w-[220px]'></img>
          <p className='text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl'>
            Create Your <span className='text-purple-600'>Vault</span>
          </p>
          <p className='mt-6 text-center font-medium pb-5 md:text-left'>
            You are almost ready to browse jobs! <br />
            Next, set up your Work Reputation Vault.
          </p>

          <div className='flex flex-col items-stretch pt-3 md:pt-0'>
            <p className=''>
              <strong className='text-center text-lg font-semibold md:text-left'>Step1</strong>
            </p>
            <a
              className='mb-4 rounded-lg bg-purple-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-purple-600 ring-offset-2 transition hover:bg-purple-600 focus:ring-2'
              href='https://testnets.sismo.io/'>
              Go on sismo
            </a>
            <p>
              <strong className='text-center text-lg font-semibold md:text-left'>Step2</strong>
            </p>
            <button
              onClick={e => {
                setStep(3);
              }}
              className='rounded-lg bg-purple-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-purple-600 ring-offset-2 transition hover:bg-purple-600 focus:ring-2'>
              Complete your profile
            </button>
          </div>
          <div className='py-12 text-center'></div>
        </div>
      </div>
      <div className='relative hidden h-screen select-none bg-purple-600 bg-gradient-to-br md:block md:w-1/2'>
        <div className='py-16 px-8 text-white xl:w-[40rem]'>
          <img src='/zkpow/vault.webp' className='pt-9 max-w-xs'></img>
          <p className='my-6 text-3xl font-semibold leading-10'>
            What is a{' '}
            <span className='abg-white whitespace-nowrap py-2 text-pink-300'>
              Work Reputation Vault
            </span>
            ?
          </p>
          <p className='mb-4'>
            How does it work? Your Work Reputation Vault uses “
            <a
              target='_blank'
              className=' text-pink-300'
              href='https://en.wikipedia.org/wiki/Zero-knowledge_proof#:~:text=Zero%2Dknowledge%3A%20if%20the%20statement,the%20prover%20knows%20the%20secret'>
              zero-knowledge
            </a>
            ” technology to prove that you’ve done work without revealing all information on your
            work history.
          </p>
          {/* <a
            href='index.html'
            className='font-semibold tracking-wide text-white underline underline-offset-4'>
            Learn More
          </a> */}
        </div>
      </div>
    </div>
  );
};

const renderStep3 = (setStep: { (value: SetStateAction<number>): void; (arg0: number): void }) => {
  return (
    <>
      <div className='flex w-screen flex-wrap text-slate-800'>
        <div className='flex w-full flex-col md:w-1/2'>
          <div className='my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[30rem]'>
            <img src='/zkpow/zkpow.webp' className='py-1 max-w-[220px]'></img>
            <p className='text-center text-2xl font-bold md:leading-tight md:text-left md:text-5xl'>
              Complete Your <span className='text-purple-600'>Worker Profile</span>
            </p>

            <div className='py-6'>
              <ProfileForm
                callback={() => {
                  setStep(4);
                }}
              />
            </div>
          </div>
        </div>
        <div className='relative hidden h-screen select-none bg-purple-600 bg-gradient-to-br md:block md:w-1/2'>
          <div className='py-16 px-8 text-white xl:w-[40rem]'>
            <img src='/zkpow/php.webp' className='pt-10 max-w-xs'></img>
            <p className='my-6 text-3xl font-semibold leading-10'>
              Finding Jobs with{' '}
              <span className='abg-white whitespace-nowrap py-2 text-pink-300'>zkPoW</span>
            </p>
            <p className='mb-4'>
              Looking for your next gig? You are in the right place. zkPoW is your access pass to
              the future of work in Web 3 and beyond - powered by TalentLayer!
            </p>
            <p className='my-3 text-2xl font-semibold leading-10'>
              <span className='abg-white whitespace-nowrap py-2 text-white'>
                What is TalentLayer?
              </span>
            </p>
            <p className='mb-4'>
              <a target='_blank' className=' text-pink-300' href='https://talentlayer.org'>
                TalentLayer
              </a>{' '}
              is a network of interoperable job and gig platforms. By creating your Work Reputation
              Vault, you are making a privacy-preserving account to access any platform on
              TalentLayer.
            </p>

            <a
              href='https://www.talentlayer.org/'
              target='_blank'
              className='font-semibold tracking-wide text-white underline underline-offset-4'>
              Learn more
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const renderStep4 = () => {
  return (
    <>
      <div className='flex w-screen flex-wrap text-slate-800'>
        <div className='flex w-full flex-col md:w-1/2'>
          <div className='flex justify-center pt-12 md:justify-start md:pl-12'></div>
          <div className='my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]'>
            <img src='/zkpow/zkpow.webp' className='py-1 max-w-[220px]'></img>
            <p className='text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl'>
              Success!
            </p>
            <p className='mt-6 text-center font-medium pb-5 md:text-left'>
              You are ready to work 😎
            </p>

            <div className='flex flex-col items-stretch pt-3 md:pt-0'>
              <a
                className='rounded-lg bg-purple-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-purple-600 ring-offset-2 transition hover:bg-purple-600 focus:ring-2 md:w-32'
                href='/services'>
                Find Work
              </a>
            </div>
            <div className='py-12 text-center'></div>
          </div>
        </div>
        <div className='relative hidden h-screen select-none bg-purple-600 bg-gradient-to-br md:block md:w-1/2'>
          <div className='py-16 px-8 text-white xl:w-[40rem]'>
            <img src='/zkpow/indie.webp' className='pt-9 max-w-xs'></img>
            <p className='my-6 text-3xl font-semibold leading-10'>
              Find your first work on
              <span className='abg-white whitespace-nowrap py-2 text-pink-300'> Indie</span>
            </p>
            <p className='mt-6 text-center font-medium pb-5 md:text-left'>
              Indie is a freelance marketplace for independent workers! Explore gigs from hirers
              around the world today.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
