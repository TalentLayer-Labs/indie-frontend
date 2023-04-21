function InfoNoPlatformId() {
  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-gray-500'>
        No platform ID associated with this account
        <br />
        Please request a Platform ID by emailing{' '}
        <a
          className='text-blue-500'
          href='mailto:labs@talentlayer.org?subject=Request for a Platform ID'
          target='_blank'>
          labs@talentlayer.org
        </a>
        <br />
        <br />
        Learn more about the{' '}
        <a
          className='text-blue-500'
          href='https://docs.talentlayer.org/basics/readme/platformid'
          target='_blank'>
          Layer Platform ID
        </a>
      </p>
    </div>
  );
}

export default InfoNoPlatformId;
