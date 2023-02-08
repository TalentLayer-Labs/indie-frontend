export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatStringDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};
