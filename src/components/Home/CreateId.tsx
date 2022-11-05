import TalentLayerIdForm from '../Form/TalentLayerIdForm';

function CreateId() {
  return (
    <>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0 py-20'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <p className='text-7xl font-medium tracking-wider max-w-lg text-center'>
              Create <span className='text-indigo-600'>Your </span> TalentLayer ID
            </p>

            <p className='text-gray-500 text-center'>
              Own your reputation as an indie freelancer.
              <br />
              Onboard your clients, leave mutual reviews, and grow your reputation.
            </p>

            <TalentLayerIdForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateId;
