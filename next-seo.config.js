const title = 'TalentLayer  - Mint your TalentLayerID now!'
const description =
  'TalentLayer is composable, decentralized, open-source infrastructure for talent markets; allowing anyone to easily build interoperable gig marketplaces.'
const url = 'https://claim.talentlayer.org'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title,
  description,
  canonical: url,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'TalentLayer - Mint your TalentLayerID now!',
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
}
