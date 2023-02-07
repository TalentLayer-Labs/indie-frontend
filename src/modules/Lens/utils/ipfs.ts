export const buildMediaUrl = (url: string): string => {
  if (url?.includes('ipfs://')) {
    return `https://ipfs.io/ipfs/${url?.replace('ipfs://', '') || ''}`;
  }
  return url;
};
