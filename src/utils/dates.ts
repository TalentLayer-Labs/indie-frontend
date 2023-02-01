export const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatTimestampDivider = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp)?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateDivider = (d?: Date) =>
  d?.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const formatTimestampDateConversationCard = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp)?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatDateConversationCard = (date: Date | undefined) => {
  if (!date) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};
