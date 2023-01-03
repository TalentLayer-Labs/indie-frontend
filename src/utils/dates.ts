export const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatDateDivider = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp)?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
