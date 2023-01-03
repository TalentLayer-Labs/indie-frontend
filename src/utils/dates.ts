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

export const formatStringDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const formatDateConversationCard = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp)?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};
