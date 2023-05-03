const title = 'TL indie';
const description = 'TL indie is a forkable dapp ';
const url = 'https://claim.talentlayer.org';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title,
  description,
  canonical: url,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'TL indie',
    title,
    description,
    images: [
      {
        url: `https://claim.talentlayer.org/images/cover.jpeg`,
        width: 2000,
        height: 1142,
        alt: 'TalentLayer profile',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@TalentLayer',
    site: '@TalentLayer',
    cardType: 'summary_large_image',
  },
};
