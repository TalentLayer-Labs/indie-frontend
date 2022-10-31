export const truncateAddress = (address: string, length = 5) => {
  return `${address.substring(0, length)}...${address.substring(
    address.length - length,
    address.length,
  )}`;
};
